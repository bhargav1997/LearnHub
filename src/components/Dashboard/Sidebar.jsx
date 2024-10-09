import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./DashboardSidebar.module.css";
import { faChevronDown, faFire } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

function Sidebar() {
   const { user } = useSelector((state) => state.user);
   return (
      <div className={styles.sideContent}>
         <div className={styles.userProfile}>
            <div className={styles.profileHeader}>
               <h3>Your Profile</h3>
               <button>
                  <FontAwesomeIcon icon={faChevronDown} />
               </button>
            </div>
            <div className={styles.profileContent}>
               <img
                  src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                  alt={user.username}
                  className={styles.avatar}
               />
               <h4>{user.username}</h4>
               <p>Continue Your Journey And Achieve Your Target</p>
               <div className={styles.hoursSpent}>
                  <h5>30 Hours Spend</h5>
                  <select>
                     <option>Last Week</option>
                     <option>Last Month</option>
                     <option>Last Year</option>
                  </select>
               </div>
               <div className={styles.weeklyChart}>
                  <div className={styles.chartBar} style={{ height: "60%" }}></div>
                  <div className={styles.chartBar} style={{ height: "80%" }}></div>
                  <div className={styles.chartBar} style={{ height: "40%" }}></div>
                  <div className={styles.chartBar} style={{ height: "90%" }}></div>
                  <div className={styles.chartBar} style={{ height: "70%" }}></div>
                  <div className={styles.chartBar} style={{ height: "50%" }}></div>
                  <div className={styles.chartBar} style={{ height: "75%" }}></div>
               </div>
               <div className={styles.streaks}>
                  <div className={styles.streakItem}>
                     <div className={styles.streakIcon}>
                        <FontAwesomeIcon icon={faFire} /> 3
                     </div>
                     <div className={styles.streakInfo}>
                        <strong>3 Week Streak</strong>
                        <span>Congrats, You&apos;re on a roll, Keep Going</span>
                     </div>
                  </div>
                  <div className={styles.streakItem}>
                     <div className={styles.streakIcon}>1</div>
                     <div className={styles.streakInfo}>
                        <strong>Learning Machine</strong>
                        <span>Read total 48 Hours</span>
                     </div>
                  </div>
                  <div className={styles.streakItem}>
                     <div className={styles.streakIcon}>
                        <FontAwesomeIcon icon={faFire} /> 2
                     </div>
                     <div className={styles.streakInfo}>
                        <strong>2 Week Streak</strong>
                        <span>Congrats, You&apos;re on a roll, Keep Going</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Sidebar;
