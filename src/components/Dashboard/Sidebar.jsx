import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./DashboardSidebar.module.css";
import { faBook, faChevronDown, faFire, faTrophy } from "@fortawesome/free-solid-svg-icons";
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
                        <FontAwesomeIcon icon={faFire} />
                     </div>
                     <div className={styles.streakInfo}>
                        <strong>3 Week Streak</strong>
                        <span>{"You're on fire! Keep it up!"}</span>
                        <div className={styles.streakProgress}>
                           <div className={styles.streakProgressBar} style={{ width: "75%" }}></div>
                        </div>
                     </div>
                  </div>
                  <div className={styles.streakItem}>
                     <div className={styles.streakIcon}>
                        <FontAwesomeIcon icon={faBook} />
                     </div>
                     <div className={styles.streakInfo}>
                        <strong>Learning Machine</strong>
                        <span>48 Hours Total Study Time</span>
                        <div className={styles.streakProgress}>
                           <div className={styles.streakProgressBar} style={{ width: "60%" }}></div>
                        </div>
                     </div>
                  </div>
                  <div className={styles.streakItem}>
                     <div className={styles.streakIcon}>
                        <FontAwesomeIcon icon={faTrophy} />
                     </div>
                     <div className={styles.streakInfo}>
                        <strong>Top Performer</strong>
                        <span>{"You're in the top 10% this week!"}</span>
                        <div className={styles.streakProgress}>
                           <div className={styles.streakProgressBar} style={{ width: "90%" }}></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Sidebar;
