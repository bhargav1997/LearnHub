import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "./redux/user/userSlice";
import styles from "./styles/App.module.css";

// Lazy load components
const Sidebar = React.lazy(() => import("./components/Sidebar"));
const Header = React.lazy(() => import("./components/Header"));
const Home = React.lazy(() => import("./components/Home"));
const Leaderboard = React.lazy(() => import("./components/Leaderboard"));
const Calendar = React.lazy(() => import("./components/Calendar"));
const Setting = React.lazy(() => import("./components/Setting"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const Message = React.lazy(() => import("./components/Message"));
const Report = React.lazy(() => import("./components/Report/Report"));
const Privacy = React.lazy(() => import("./components/Privacy"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
const LoadingSpinner = React.lazy(() => import("./components/LoadingSpinner"));
const UserProfile = React.lazy(() => import("./components/UserProfile"));
const Onboarding = React.lazy(() => import("./components/Onboarding"));
const LearningJourney = React.lazy(() => import("./components/LearningJourney"));

function App() {
   const [showOnboarding, setShowOnboarding] = useState(false);

   const dispatch = useDispatch();
   const { isLoading } = useSelector((state) => state.user);
   const isAuthenticated = true;

   useEffect(() => {
      // Check if the user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
      if (!hasCompletedOnboarding) {
         setShowOnboarding(true);
      }
   }, []);

   useEffect(() => {
      const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
      if (rememberedUser) {
         dispatch(setUser({ email: rememberedUser.email, username: rememberedUser.username }));
      } else {
         dispatch(setLoading(false));
      }
   }, [dispatch]);

   const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      localStorage.setItem("hasCompletedOnboarding", "true");
   };

   if (isLoading) {
      return <LoadingSpinner />;
   }

   return (
      <Router>
         <div className={styles.appContainer}>
            {showOnboarding && (
               <Suspense fallback={<LoadingSpinner />}>
                  <Onboarding onComplete={handleOnboardingComplete} />
               </Suspense>
            )}

            {isAuthenticated && (
               <aside className={styles.sidebar}>
                  <Suspense fallback={<LoadingSpinner />}>
                     <Sidebar />
                  </Suspense>
               </aside>
            )}
            <div className={styles.mainArea}>
               <Suspense fallback={<LoadingSpinner />}>
                  <Header />
               </Suspense>
               <main className={styles.content}>
                  <Suspense fallback={<LoadingSpinner />}>
                     <Routes>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />

                        <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to='/login' />} />
                        <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />} />
                        <Route path='/leaderboard' element={isAuthenticated ? <Leaderboard /> : <Navigate to='/login' />} />
                        <Route path='/learning-journey' element={isAuthenticated ? <LearningJourney /> : <Navigate to='/login' />} />
                        {/* <Route path='/message' element={isAuthenticated ? <Message /> : <Navigate to='/login' />} /> */}
                        <Route path='/message' element={isAuthenticated ? <Message /> : <Navigate to='/login' />} />
                        <Route path='/calendar' element={isAuthenticated ? <Calendar /> : <Navigate to='/login' />} />
                        <Route path='/privacy' element={isAuthenticated ? <Privacy /> : <Navigate to='/login' />} />
                        <Route path='/report' element={isAuthenticated ? <Report /> : <Navigate to='/login' />} />
                        <Route path='/user-profile' element={isAuthenticated ? <UserProfile /> : <Navigate to='/login' />} />
                        <Route path='/setting' element={isAuthenticated ? <Setting /> : <Navigate to='/login' />} />
                     </Routes>
                  </Suspense>
               </main>
            </div>
         </div>
      </Router>
   );
}

export default App;
