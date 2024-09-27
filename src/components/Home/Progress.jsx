// import React from "react";
// import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faClock, faChartLine } from "@fortawesome/free-solid-svg-icons";
import styles from "./Progress.module.css";

function Progress() {
   //    const user = useSelector((state) => state.user.currentUser);

   // This would be fetched from an API in a real application
   const userProgress = {
      coursesCompleted: 5,
      totalCourses: 10,
      skillsImproved: ["JavaScript", "React", "Node.js"],
      hoursSpent: 120,
   };

   return (
      <div className={styles.progressContainer}>
         <h2 className={styles.progressTitle}>Your Learning Progress</h2>
         <div className={styles.progressStats}>
            <div className={styles.stat}>
               <FontAwesomeIcon icon={faGraduationCap} className={styles.statIcon} />
               <div className={styles.statInfo}>
                  <h3>Courses Completed</h3>
                  <p>
                     {userProgress.coursesCompleted} / {userProgress.totalCourses}
                  </p>
               </div>
            </div>
            <div className={styles.stat}>
               <FontAwesomeIcon icon={faChartLine} className={styles.statIcon} />
               <div className={styles.statInfo}>
                  <h3>Skills Improved</h3>
                  <ul className={styles.skillsList}>
                     {userProgress.skillsImproved.map((skill, index) => (
                        <li key={index}>{skill}</li>
                     ))}
                  </ul>
               </div>
            </div>
            <div className={styles.stat}>
               <FontAwesomeIcon icon={faClock} className={styles.statIcon} />
               <div className={styles.statInfo}>
                  <h3>Total Learning Hours</h3>
                  <p>{userProgress.hoursSpent} hours</p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Progress;
