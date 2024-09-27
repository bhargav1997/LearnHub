import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSearch, faEnvelope, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";

function Header() {
   const [showUserMenu, setShowUserMenu] = useState(false);

   return (
      <header className={styles.header}>
         <div className={styles.leftSection}>
            <h2 className={styles.greeting}>Welcome, Shrey!</h2>
            {/* <button className={styles.addButton}>
               <FontAwesomeIcon icon={faPlus} /> Add Content
            </button> */}
         </div>
         <div className={styles.rightSection}>
            <div className={styles.searchBar}>
               <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
               <input type='text' placeholder='Search courses, books, videos...' className={styles.searchInput} />
            </div>
            <button className={styles.iconButton}>
               <FontAwesomeIcon icon={faEnvelope} />
               <span className={styles.badge}>3</span>
            </button>
            <button className={styles.iconButton}>
               <FontAwesomeIcon icon={faBell} />
               <span className={styles.badge}>5</span>
            </button>
            <div className={styles.userInfo} onClick={() => setShowUserMenu(!showUserMenu)}>
               <div className={styles.userAvatar}>
                  <img src='https://api.dicebear.com/6.x/initials/svg?seed=NM' alt='Nityam Mishra' />
               </div>
               {showUserMenu && (
                  <div className={styles.userMenu}>
                     <a href='/user-profile'>
                        <FontAwesomeIcon icon={faUser} /> Profile
                     </a>
                     <a href='/setting'>
                        <FontAwesomeIcon icon={faCog} /> Settings
                     </a>
                     <a href='#logout'>
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
