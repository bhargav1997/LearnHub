import { useSelector } from "react-redux";
import styles from "./Home.module.css";

function Profile() {
   const { user } = useSelector((state) => state.user);

   console.log(user);

   return (
      <div className={styles.userProfile}>
         <h2 className={styles.title}>Your Profile</h2>
         <div className={styles.profileInfo}>
            <img
               src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
               alt={user.username}
               className={styles.avatar}
            />
            <h3 className={styles.name}>{user.username}</h3>
            <p className={styles.bio}>{user.bio}</p>
         </div>
         <div className={styles.hoursSpent}>
            <h4>30 Hours Spent</h4>
            <select className={styles.timeSelect}>
               <option>Last Week</option>
               <option>Last Month</option>
               <option>Last Year</option>
            </select>
         </div>
         <div className={styles.weeklyChart}>
            {/* You can add a chart component here */}
            <div className={styles.barChart}>
               <div className={styles.bar} style={{ height: "50%" }}></div>
               <div className={styles.bar} style={{ height: "80%" }}></div>
               <div className={styles.bar} style={{ height: "30%" }}></div>
               <div className={styles.bar} style={{ height: "60%" }}></div>
               <div className={styles.bar} style={{ height: "40%" }}></div>
               <div className={styles.bar} style={{ height: "70%" }}></div>
               <div className={styles.bar} style={{ height: "55%" }}></div>
            </div>
         </div>
      </div>
   );
}

export default Profile;
