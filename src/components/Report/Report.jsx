import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faClock, faTrophy, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import styles from "./Report.module.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

function Report() {
   const [reportData, setReportData] = useState(null);

   useEffect(() => {
      // Simulating API call to fetch report data
      const fetchReportData = async () => {
         // In a real application, this would be an API call
         const data = {
            totalLearningTime: 120, // hours
            tasksCompleted: 25,
            currentStreak: 7,
            longestStreak: 14,
            taskCategories: {
               "YouTube Playlists": 10,
               "Online Courses": 8,
               Books: 5,
               Other: 2,
            },
            weeklyProgress: [
               { week: "Week 1", hours: 20 },
               { week: "Week 2", hours: 25 },
               { week: "Week 3", hours: 18 },
               { week: "Week 4", hours: 30 },
            ],
            topSkills: ["Python", "React", "Data Science", "Machine Learning"],
         };
         setReportData(data);
      };

      fetchReportData();
   }, []);

   if (!reportData) return <div>Loading...</div>;

   const pieChartData = {
      labels: Object.keys(reportData.taskCategories),
      datasets: [
         {
            data: Object.values(reportData.taskCategories),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
         },
      ],
   };

   const lineChartData = {
      labels: reportData.weeklyProgress.map((item) => item.week),
      datasets: [
         {
            label: "Learning Hours",
            data: reportData.weeklyProgress.map((item) => item.hours),
            fill: false,
            borderColor: "#7c4dff",
            tension: 0.1,
         },
      ],
   };

   return (
      <div className={styles.reportContainer}>
         <h1 className={styles.reportTitle}>Your Learning Report</h1>

         <div className={styles.statsGrid}>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faClock} className={styles.statIcon} />
               <h3>Total Learning Time</h3>
               <p>{reportData.totalLearningTime} hours</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faBook} className={styles.statIcon} />
               <h3>Tasks Completed</h3>
               <p>{reportData.tasksCompleted}</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faTrophy} className={styles.statIcon} />
               <h3>Current Streak</h3>
               <p>{reportData.currentStreak} days</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faChartLine} className={styles.statIcon} />
               <h3>Longest Streak</h3>
               <p>{reportData.longestStreak} days</p>
            </div>
         </div>

         <div className={styles.chartsContainer}>
            <div className={styles.chartCard}>
               <h3>Task Categories</h3>
               <Pie data={pieChartData} />
            </div>
            <div className={styles.chartCard}>
               <h3>Weekly Progress</h3>
               <Line data={lineChartData} />
            </div>
         </div>

         <div className={styles.skillsSection}>
            <h3>Top Skills</h3>
            <div className={styles.skillTags}>
               {reportData.topSkills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                     {skill}
                  </span>
               ))}
            </div>
         </div>
      </div>
   );
}

export default Report;
