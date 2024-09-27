import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import Calendar from "./components/Calendar";
import Setting from "./components/Setting";
import Dashboard from "./components/Dashboard";
import Message from "./components/Message";
import Report from "./components/Report/Report";
import Privacy from "./components/Privacy";
import Register from "./components/Register";
import Login from "./components/Login";
import styles from "./styles/App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "./redux/user/userSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import UserProfile from "./components/UserProfile";

function App() {
   const dispatch = useDispatch();
   const { isLoading } = useSelector((state) => state.user);
   const isAuthenticated = true;

   useEffect(() => {
      const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
      if (rememberedUser) {
         dispatch(setUser({ email: rememberedUser.email, username: rememberedUser.username }));
      } else {
         dispatch(setLoading(false));
      }
   }, [dispatch]);

   if (isLoading) {
      return <LoadingSpinner />;
   }

   return (
      <Router>
         <div className={styles.appContainer}>
            {isAuthenticated && (
               <aside className={styles.sidebar}>
                  <Sidebar />
               </aside>
            )}
            <div className={styles.mainArea}>
               <Header />
               <main className={styles.content}>
                  <Routes>
                     <Route path='/register' element={<Register />} />
                     <Route path='/login' element={<Login />} />

                     <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to='/login' />} />
                     <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />} />
                     <Route path='/leaderboard' element={isAuthenticated ? <Leaderboard /> : <Navigate to='/login' />} />
                     <Route path='/message' element={isAuthenticated ? <Message /> : <Navigate to='/login' />} />
                     <Route path='/calendar' element={isAuthenticated ? <Calendar /> : <Navigate to='/login' />} />
                     <Route path='/privacy' element={isAuthenticated ? <Privacy /> : <Navigate to='/login' />} />
                     <Route path='/report' element={isAuthenticated ? <Report /> : <Navigate to='/login' />} />
                     <Route path='/user-profile' element={isAuthenticated ? <UserProfile /> : <Navigate to='/login' />} />
                     <Route path='/setting' element={isAuthenticated ? <Setting /> : <Navigate to='/login' />} />
                  </Routes>
               </main>
            </div>
         </div>
      </Router>
   );
}

export default App;
