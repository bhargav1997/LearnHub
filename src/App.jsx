import React, { useEffect, useState, Suspense } from "react";
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import { setUser, setLoading } from "./redux/user/userSlice";
import styles from "./styles/App.module.css";

// Import components
import Sidebar from "./components/Sidebar";
import Onboarding from "./components/Onboarding";
import SidebarSkeleton from "./components/Sidebar/SidebarSkeleton";
import LoadingSpinner from "./components/LoadingSpinner";
import PropTypes from "prop-types";
import TwoFactorAuth from "./components/TwoFactorAuth/TwoFactorAuth";
// import { fetchConnections } from "./redux/user/userHandle";

// Lazy load other components
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
const UserProfile = React.lazy(() => import("./components/UserProfile"));
const LearningJourney = React.lazy(() => import("./components/LearningJourney"));
import { CONFIG } from "./config";

function ErrorFallback({ error }) {
   return (
      <div role='alert'>
         <p>Something went wrong:</p>
         <pre>{error.message}</pre>
      </div>
   );
}

ErrorFallback.propTypes = {
   error: PropTypes.object.isRequired,
};

function App() {
   const [showOnboarding, setShowOnboarding] = useState(false);
   const dispatch = useDispatch();
   const { user, isLoading } = useSelector((state) => state.user);
   const API_URL = CONFIG.API_URL;
   const isAuthenticated = !!user;

   useEffect(() => {
      const checkAuthStatus = async () => {
         dispatch(setLoading(true));
         const token = localStorage.getItem("token");
         if (token) {
            try {
               const response = await fetch(`${API_URL}/users/profile`, {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });
               if (response.ok) {
                  const userData = await response.json();
                  dispatch(setUser(userData));
                  // Remove the startTransition here as it's not necessary for this operation
                  const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
                  if (!hasCompletedOnboarding) {
                     setShowOnboarding(true);
                  }
               } else {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  dispatch(setUser(null));
               }
            } catch (error) {
               console.error("Error verifying token:", error);
               dispatch(setUser(null));
            }
         } else {
            dispatch(setUser(null));
         }
         dispatch(setLoading(false));
      };

      checkAuthStatus();
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
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className={styles.appContainer}>
               <div className={`${styles.appContent} ${showOnboarding ? styles.blurred : ""}`}>
                  {isAuthenticated && (
                     <aside className={styles.sidebar}>{isAuthenticated && isLoading ? <SidebarSkeleton /> : <Sidebar />}</aside>
                  )}
                  <div className={styles.mainArea}>
                     <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                           <Route path='/register' element={isAuthenticated ? <Navigate to='/' /> : <Register />} />
                           <Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
                           <Route path='/two-factor-auth' element={isAuthenticated ? <Navigate to='/' /> : <TwoFactorAuth />} />

                           {isAuthenticated && (
                              <Route element={<AuthenticatedLayout />}>
                                 <Route path='/' element={<Home />} />
                                 <Route path='/dashboard' element={<Dashboard />} />
                                 <Route path='/leaderboard' element={<Leaderboard />} />
                                 <Route path='/learning-journey' element={<LearningJourney />} />
                                 <Route path='/message' element={<Message />} />
                                 <Route path='/calendar' element={<Calendar />} />
                                 <Route path='/privacy' element={<Privacy />} />
                                 <Route path='/report' element={<Report />} />
                                 <Route path='/user-profile' element={<UserProfile />} />
                                 <Route path='/setting' element={<Setting />} />
                                 <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                              </Route>
                           )}

                           {!isLoading && !isAuthenticated && <Route path='*' element={<Login />} />}
                        </Routes>
                     </Suspense>
                  </div>
               </div>
               {showOnboarding && isAuthenticated && <Onboarding onComplete={handleOnboardingComplete} />}
            </div>
         </ErrorBoundary>
      </Router>
   );
}

function AuthenticatedLayout() {
   return (
      <>
         <header className={styles.header}>
            <Suspense fallback={<LoadingSpinner />}>
               <Header />
            </Suspense>
         </header>
         <main className={styles.content}>
            <Outlet />
         </main>
      </>
   );
}

export default App;
