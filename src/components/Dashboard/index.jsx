import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronDown, faFire } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Dashboard.css";
import CreateLearningTask from "./CreateLearningTask";

function Dashboard() {
   const [showCreateTask, setShowCreateTask] = useState(false);

   const learningMapData = [
      { name: "Advance Node JS", level: "Advance", progress: 0, status: "Not Started", timeRemain: "30 Hrs" },
      { name: "AI Integration", level: "Intermediate", progress: 70, status: "In Progress", timeRemain: "6 Hrs" },
      { name: "MERN Stack development", level: "Advance", progress: 10, status: "Paused", timeRemain: "2 Days" },
      { name: "AI Integration", level: "Intermediate", progress: 100, status: "Completed", timeRemain: "2 days" },
      { name: "MERN Stack development", level: "Advance", progress: 90, status: "In Progress", timeRemain: "12 Hrs" },
      { name: "MERN Stack development", level: "Advance", progress: 30, status: "In Progress", timeRemain: "21 Hrs" },
   ];

   return (
      <div className='dashboard'>
         <div className='main-content'>
            <div className='hero-banner'>
               <div className='hero-content'>
                  <h2>Sharpen Your Coding Skills With Professional Online Courses</h2>
                  <button className='create-log-btn' onClick={() => setShowCreateTask(true)}>
                     Create Log Now <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  {showCreateTask && <CreateLearningTask onClose={() => setShowCreateTask(false)} />}
               </div>
               <div className='hero-image'></div>
            </div>
            <div className='stats-container'>
               <div className='stat-card'>
                  <h3>24</h3>
                  <p>Enrolled Course</p>
                  <a href='#'>
                     View Details <FontAwesomeIcon icon={faChevronRight} />
                  </a>
               </div>
               <div className='stat-card'>
                  <h3>56</h3>
                  <p>Lessons</p>
                  <a href='#'>
                     View Details <FontAwesomeIcon icon={faChevronRight} />
                  </a>
               </div>
               <div className='stat-card'>
                  <h3>12</h3>
                  <p>Certificates</p>
                  <a href='#'>
                     View Details <FontAwesomeIcon icon={faChevronRight} />
                  </a>
               </div>
            </div>
            <div className='learning-map'>
               <div className='section-header'>
                  <h3>Learning Map</h3>
                  <a href='#'>See All</a>
               </div>
               <div className='learning-map-content'>
                  {learningMapData.map((course, index) => (
                     <div key={index} className='course-item'>
                        <div className='course-info'>
                           <div className={`course-icon ${course.level.toLowerCase()}`}></div>
                           <div className='course-details'>
                              <h4>{course.name}</h4>
                              <span className='course-level'>{course.level}</span>
                           </div>
                        </div>
                        <div className='course-progress'>
                           <div className='progress-bar'>
                              <div className='progress' style={{ width: `${course.progress}%` }}></div>
                           </div>
                           <span className='progress-text'>{course.progress}%</span>
                        </div>
                        <span className={`status ${course.status.toLowerCase().replace(" ", "-")}`}>{course.status}</span>
                        <span className='time-remain'>{course.timeRemain}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
         <div className='side-content'>
            <div className='user-profile'>
               <div className='profile-header'>
                  <h3>Your Profile</h3>
                  <button>
                     <FontAwesomeIcon icon={faChevronDown} />
                  </button>
               </div>
               <div className='profile-content'>
                  <img src='https://api.dicebear.com/6.x/initials/svg?seed=NM' alt='Nityam Mishra' className='avatar' />
                  <h4>Nityam Mishra</h4>
                  <p>Continue Your Journey And Achieve Your Target</p>
                  <div className='hours-spent'>
                     <h5>30 Hours Spend</h5>
                     <select>
                        <option>Last Week</option>
                        <option>Last Month</option>
                        <option>Last Year</option>
                     </select>
                  </div>
                  <div className='weekly-chart'>
                     <div className='chart-bar' style={{ height: "60%" }}></div>
                     <div className='chart-bar' style={{ height: "80%" }}></div>
                     <div className='chart-bar' style={{ height: "40%" }}></div>
                     <div className='chart-bar' style={{ height: "90%" }}></div>
                     <div className='chart-bar' style={{ height: "70%" }}></div>
                     <div className='chart-bar' style={{ height: "50%" }}></div>
                     <div className='chart-bar' style={{ height: "75%" }}></div>
                  </div>
                  <div className='streaks'>
                     <div className='streak-item'>
                        <div className='streak-icon'>
                           <FontAwesomeIcon icon={faFire} /> 3
                        </div>
                        <div className='streak-info'>
                           <strong>3 Week Streak</strong>
                           <span>{"Congrats, You're on a roll, Keep Going"}</span>
                        </div>
                     </div>
                     <div className='streak-item'>
                        <div className='streak-icon'>1</div>
                        <div className='streak-info'>
                           <strong>Learning Machine</strong>
                           <span>Read total 48 Hours</span>
                        </div>
                     </div>
                     <div className='streak-item'>
                        <div className='streak-icon'>
                           <FontAwesomeIcon icon={faFire} /> 2
                        </div>
                        <div className='streak-info'>
                           <strong>2 Week Streak</strong>
                           <span>{"Congrats, You're on a roll, Keep Going"}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
