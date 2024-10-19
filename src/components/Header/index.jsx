import React, { useState, useEffect, useRef } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";

function Header() {
   const [showUserMenu, setShowUserMenu] = useState(false);
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.user.user);
   const notificationRef = useRef(null);

   useEffect(() => {
      fetchNotifications();
   }, []);

   useEffect(() => {
      function handleClickOutside(event) {
         if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const fetchNotifications = async () => {
      try {
         const response = await axios.get(`${CONFIG.API_URL}/notifications`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });
         setNotifications(response.data);
      } catch (error) {
         console.error("Failed to fetch notifications:", error);
      }
   };

   const handleShareResponse = async (journeyId, status) => {
      try {
         await axios.put(
            `${CONFIG.API_URL}/learning-journeys/shared/${journeyId}/respond`,
            { response: status },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );
         toast.success(`Journey ${status === "accept" ? "accepted" : "rejected"} successfully`);
         fetchNotifications(); // Refresh notifications
      } catch (error) {
         toast.error(`Failed to ${status} journey`);
      }
   };

   const markAsRead = (id) => {
      setNotifications(notifications.map((notif) => (notif._id === id ? { ...notif, read: true } : notif)));
   };

   const removeNotification = (id) => {
      setNotifications(notifications.filter((notif) => notif._id !== id));
   };

   const unreadCount = notifications.filter((notif) => !notif.read).length;

   const handleLogout = () => {
      dispatch(deleteUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
   };

   console.log('notifications',notifications);

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
            <div className={styles.notificationContainer} ref={notificationRef}>
               <button className={styles.iconButton} onClick={() => setShowNotifications(!showNotifications)}>
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.filter((n) => !n.read).length > 0 && (
                     <span className={styles.badge}>{notifications.filter((n) => !n.read).length}</span>
                  )}
               </button>
               {showNotifications && (
                  <div className={styles.notificationsOverlay}>
                     <h3>Notifications</h3>
                     {notifications.length === 0 ? (
                        <p className={styles.noNotifications}>No new notifications</p>
                     ) : (
                        <ul className={styles.notificationsList}>
                           {notifications.map((notification) => (
                              <li key={notification._id} className={`${styles.notificationItem} ${notification.read ? styles.read : ""}`}>
                                 <FontAwesomeIcon icon={getNotificationIcon(notification.type)} className={styles.notificationIcon} />
                                 <div className={styles.notificationContent}>
                                    <p>{notification.message}</p>
                                    <span className={styles.notificationTime}>{formatNotificationTime(notification.createdAt)}</span>
                                 </div>
                                 {notification.type === "journey_shared" && (
                                    <div className={styles.notificationActions}>
                                       <button
                                          onClick={() => handleShareResponse(notification.sharedJourneyId, "accept")}
                                          className={styles.acceptButton}>
                                          <FontAwesomeIcon icon={faCheck} />
                                       </button>
                                       <button
                                          onClick={() => handleShareResponse(notification.sharedJourneyId, "reject")}
                                          className={styles.rejectButton}>
                                          <FontAwesomeIcon icon={faTimes} />
                                       </button>
                                    </div>
                                 )}
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>
               )}
            </div>
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

function getNotificationIcon(type) {
   switch (type) {
      case "journey_shared":
         return faBook;
      case "course":
         return faGraduationCap;
      case "achievement":
         return faTrophy;
      case "comment":
         return faComment;
      default:
         return faBell;
   }
}

function formatNotificationTime(createdAt) {
   const now = new Date();
   const notificationDate = new Date(createdAt);
   const diffTime = Math.abs(now - notificationDate);
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

   if (diffDays < 1) {
      return "Today";
   } else if (diffDays === 1) {
      return "Yesterday";
   } else if (diffDays < 7) {
      return `${diffDays} days ago`;
   } else {
      return notificationDate.toLocaleDateString();
   }
}

export default Header;
