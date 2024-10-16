import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBook,
   faClock,
   faTrophy,
   faChartLine,
   faGraduationCap,
   faCalendarAlt,
   faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   BarElement,
} from "chart.js";
import styles from "./Report.module.css";
import axios from "axios";
import { CONFIG } from "../../config";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

function Report() {
   const [reportData, setReportData] = useState(null);

   useEffect(() => {
      const fetchReportData = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${CONFIG.API_URL}/tasks/user-stats`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            setReportData(response.data);
         } catch (error) {
            console.error("Error fetching report data:", error);
            // Use dummy data if API call fails
            setReportData({
               totalLearningTime: 3600,
               tasksCompleted: 15,
               currentStreak: 5,
               longestStreak: 10,
               lastActivityDate: "2023-06-01T12:00:00Z",
               topSkills: [
                  { skill: "JavaScript", count: 8 },
                  { skill: "React", count: 5 },
                  { skill: "Node.js", count: 3 },
               ],
               learningTasksCompleted: 20,
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
               monthlyTaskCompletion: [
                  { month: "Jan", tasks: 5 },
                  { month: "Feb", tasks: 8 },
                  { month: "Mar", tasks: 12 },
                  { month: "Apr", tasks: 7 },
                  { month: "May", tasks: 15 },
                  { month: "Jun", tasks: 10 },
               ],
            });
         }
      };

      fetchReportData();
   }, []);

   if (!reportData) return <div>Loading...</div>;

   const pieChartData = {
      labels: Object.keys(reportData.taskCategories || {
         "YouTube Playlists": 10,
         "Online Courses": 8,
         Books: 5,
         Other: 2,
      }),
      datasets: [
         {
            data: Object.values(reportData.taskCategories || {
               "YouTube Playlists": 10,
               "Online Courses": 8,
               Books: 5,
               Other: 2,
            }),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
         },
      ],
   };

   const lineChartData = {
      labels: (reportData.weeklyProgress || [
         { week: "Week 1", hours: 20 },
         { week: "Week 2", hours: 25 },
         { week: "Week 3", hours: 18 },
         { week: "Week 4", hours: 30 },
      ]).map((item) => item.week),
      datasets: [
         {
            label: "Learning Hours",
            data: (reportData.weeklyProgress || [
               { week: "Week 1", hours: 20 },
               { week: "Week 2", hours: 25 },
               { week: "Week 3", hours: 18 },
               { week: "Week 4", hours: 30 },
            ]).map((item) => item.hours),
            fill: false,
            borderColor: "#7c4dff",
            tension: 0.1,
         },
      ],
   };

   const barChartData = {
      labels: (reportData.monthlyTaskCompletion || [
         { month: "Jan", tasks: 5 },
         { month: "Feb", tasks: 8 },
         { month: "Mar", tasks: 12 },
         { month: "Apr", tasks: 7 },
         { month: "May", tasks: 15 },
         { month: "Jun", tasks: 10 },
      ]).map((item) => item.month),
      datasets: [
         {
            label: "Tasks Completed",
            data: (reportData.monthlyTaskCompletion || [
               { month: "Jan", tasks: 5 },
               { month: "Feb", tasks: 8 },
               { month: "Mar", tasks: 12 },
               { month: "Apr", tasks: 7 },
               { month: "May", tasks: 15 },
               { month: "Jun", tasks: 10 },
            ]).map((item) => item.tasks),
            backgroundColor: "#7c4dff",
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
               <p>{Math.round((reportData.totalLearningTime || 0) / 60)} hours</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faBook} className={styles.statIcon} />
               <h3>Tasks Completed</h3>
               <p>{reportData.tasksCompleted || 0}</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faTrophy} className={styles.statIcon} />
               <h3>Current Streak</h3>
               <p>{reportData.currentStreak || 0} days</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faChartLine} className={styles.statIcon} />
               <h3>Longest Streak</h3>
               <p>{reportData.longestStreak || 0} days</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faGraduationCap} className={styles.statIcon} />
               <h3>Learning Tasks Completed</h3>
               <p>{reportData.learningTasksCompleted || 0}</p>
            </div>
            <div className={styles.statCard}>
               <FontAwesomeIcon icon={faCalendarAlt} className={styles.statIcon} />
               <h3>Last Activity</h3>
               <p>{reportData.lastActivityDate ? new Date(reportData.lastActivityDate).toLocaleDateString() : 'N/A'}</p>
            </div>
         </div>

         {(reportData.topSkills && reportData.topSkills.length > 0) && (
            <div className={styles.skillsSection}>
               <h3><FontAwesomeIcon icon={faBrain} /> Top Skills</h3>
               <div className={styles.skillTags}>
                  {reportData.topSkills.map((skill, index) => (
                     <span key={index} className={styles.skillTag}>
                        {skill.skill} ({skill.count})
                     </span>
                  ))}
               </div>
            </div>
         )}

         <div className={styles.chartsContainer}>
            <div className={styles.chartCard}>
               <h3>Task Categories</h3>
               <Pie data={pieChartData} />
            </div>
            <div className={styles.chartCard}>
               <h3>Weekly Learning Progress</h3>
               <Line data={lineChartData} />
            </div>
            <div className={styles.chartCard}>
               <h3>Monthly Task Completion</h3>
               <Bar data={barChartData} />
            </div>
         </div>
      </div>
   );
}

export default Report;