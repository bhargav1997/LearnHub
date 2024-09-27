import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faClock, faBook, faFire } from "@fortawesome/free-solid-svg-icons";
import styles from "./Leaderboard.module.css";

function Leaderboard() {
   const [leaderboardData, setLeaderboardData] = useState([]);
   const [timeFrame, setTimeFrame] = useState("weekly");

   useEffect(() => {
      // Simulating API call to fetch leaderboard data
      const fetchLeaderboardData = async () => {
         // In a real application, this would be an API call
         const mockData = [
            { id: 1, name: "John Doe", score: 1250, tasksCompleted: 25, totalTime: 3600, streak: 7 },
            { id: 2, name: "Jane Smith", score: 1150, tasksCompleted: 23, totalTime: 3300, streak: 5 },
            { id: 3, name: "Alex Johnson", score: 1100, tasksCompleted: 22, totalTime: 3200, streak: 6 },
            { id: 4, name: "Emily Brown", score: 1050, tasksCompleted: 21, totalTime: 3100, streak: 4 },
            { id: 5, name: "Michael Wilson", score: 1000, tasksCompleted: 20, totalTime: 3000, streak: 3 },
            { id: 6, name: "Sarah Davis", score: 950, tasksCompleted: 19, totalTime: 2900, streak: 2 },
            { id: 7, name: "Chris Taylor", score: 900, tasksCompleted: 18, totalTime: 2800, streak: 1 },
            { id: 8, name: "Emma Martinez", score: 850, tasksCompleted: 17, totalTime: 2700, streak: 3 },
            { id: 9, name: "David Anderson", score: 800, tasksCompleted: 16, totalTime: 2600, streak: 2 },
            { id: 10, name: "Olivia Thomas", score: 750, tasksCompleted: 15, totalTime: 2500, streak: 1 },
         ];
         setLeaderboardData(mockData);
      };

      fetchLeaderboardData();
   }, [timeFrame]);

   const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
   };

   return (
      <div className={styles.leaderboardContainer}>
         <h1 className={styles.leaderboardTitle}>Global Leaderboard</h1>

         <div className={styles.timeFrameSelector}>
            <button
               className={`${styles.timeFrameButton} ${timeFrame === "weekly" ? styles.active : ""}`}
               onClick={() => setTimeFrame("weekly")}>
               Weekly
            </button>
            <button
               className={`${styles.timeFrameButton} ${timeFrame === "monthly" ? styles.active : ""}`}
               onClick={() => setTimeFrame("monthly")}>
               Monthly
            </button>
            <button
               className={`${styles.timeFrameButton} ${timeFrame === "allTime" ? styles.active : ""}`}
               onClick={() => setTimeFrame("allTime")}>
               All Time
            </button>
         </div>

         <div className={styles.leaderboardList}>
            {leaderboardData.map((user, index) => (
               <div key={user.id} className={styles.leaderboardItem}>
                  <div className={styles.rankAndUser}>
                     <div className={styles.rank}>
                        {index < 3 ? (
                           <FontAwesomeIcon icon={faTrophy} className={`${styles.trophyIcon} ${styles[`trophy${index + 1}`]}`} />
                        ) : (
                           `#${index + 1}`
                        )}
                     </div>
                     <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={styles.userScore}>{user.score} points</span>
                     </div>
                  </div>
                  <div className={styles.userStats}>
                     <span className={styles.statItem}>
                        <FontAwesomeIcon icon={faBook} /> {user.tasksCompleted}
                     </span>
                     <span className={styles.statItem}>
                        <FontAwesomeIcon icon={faClock} /> {formatTime(user.totalTime)}
                     </span>
                     <span className={styles.statItem}>
                        <FontAwesomeIcon icon={faFire} /> {user.streak} day streak
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default Leaderboard;
