import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBell,
   faUser,
   faSearch,
   faEnvelope,
   faCog,
   faSignOutAlt,
   faGraduationCap,
   faBook,
   faComment,
   faTrophy,
   faCheck,
   faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../redux/user/userHandle";
import { Link, useNavigate } from "react-router-dom";

// Dummy notification data
const initialNotifications = [
   {
      id: 1,
      type: "course",
      icon: faGraduationCap,
      message: 'New course "Advanced Machine Learning" is now available!',
      time: "2 hours ago",
      read: false,
   },
   {
      id: 2,
      type: "achievement",
      icon: faTrophy,
      message: 'Congratulations! You\'ve completed the "Python Basics" course.',
      time: "1 day ago",
      read: false,
   },
   {
      id: 3,
      type: "comment",
      icon: faComment,
      message: 'John Doe replied to your comment in "Web Development 101".',
      time: "2 days ago",
      read: false,
   },
   {
      id: 4,
      type: "book",
      icon: faBook,
      message: 'New book added to your "Machine Learning" learning path.',
      time: "3 days ago",
      read: false,
   },
   {
      id: 5,
      type: "course",
      icon: faGraduationCap,
      message: 'Your "JavaScript Fundamentals" course will expire in 3 days.',
      time: "4 days ago",
      read: false,
   },
];

function Header() {
   const [showUserMenu, setShowUserMenu] = useState(false);
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState(initialNotifications);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.user.user);

   const markAsRead = (id) => {
      setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)));
   };

   const removeNotification = (id) => {
      setNotifications(notifications.filter((notif) => notif.id !== id));
   };

   const unreadCount = notifications.filter((notif) => !notif.read).length;

   const handleLogout = () => {
      dispatch(deleteUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
   };

   return (
      <header className={styles.header}>
         <div className={styles.leftSection}>
            <h2 className={styles.greeting}>Welcome, {user.username ? user.username : "Guest"} 👋 </h2>
            {/* <button className={styles.addButton}>
               <FontAwesomeIcon icon={faPlus} /> Add Content
            </button> */}
         </div>
         <div className={styles.rightSection}>
            <div className={styles.searchBar}>
               <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
               <input type='text' placeholder='Search courses, books, videos...' className={styles.searchInput} />
            </div>
            <Link className={styles.iconButton} to='/message'>
               <FontAwesomeIcon icon={faEnvelope} />
               <span className={styles.badge}>3</span>
            </Link>
            <button className={styles.iconButton} onClick={() => setShowNotifications(!showNotifications)}>
               <FontAwesomeIcon icon={faBell} />
               {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>
            {showNotifications && (
               <div className={styles.notificationsOverlay}>
                  <h3>Notifications</h3>
                  {notifications.length === 0 ? (
                     <p className={styles.noNotifications}>No new notifications</p>
                  ) : (
                     <ul className={styles.notificationsList}>
                        {notifications.map((notification) => (
                           <li key={notification.id} className={`${styles.notificationItem} ${notification.read ? styles.read : ""}`}>
                              <FontAwesomeIcon icon={notification.icon} className={styles.notificationIcon} />
                              <div className={styles.notificationContent}>
                                 <p>{notification.message}</p>
                                 <span className={styles.notificationTime}>{notification.time}</span>
                              </div>
                              <div className={styles.notificationActions}>
                                 {!notification.read && (
                                    <button onClick={() => markAsRead(notification.id)} className={styles.readButton}>
                                       <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                 )}
                                 <button onClick={() => removeNotification(notification.id)} className={styles.removeButton}>
                                    <FontAwesomeIcon icon={faTimes} />
                                 </button>
                              </div>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            )}
            <div className={styles.userInfo} onClick={() => setShowUserMenu(!showUserMenu)}>
               <div className={styles.userAvatar}>
                  <img src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} alt={user.username} />
               </div>
               {showUserMenu && (
                  <div className={styles.userMenu}>
                     <Link to='/user-profile'>
                        <FontAwesomeIcon icon={faUser} /> Profile
                     </Link>
                     <Link to='/setting'>
                        <FontAwesomeIcon icon={faCog} /> Settings
                     </Link>
                     <a onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                     </a>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}

export default Header;
