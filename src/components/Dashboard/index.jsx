import {
   faBook,
   faChevronRight,
   faClock,
   faEdit,
   faGraduationCap,
   faNewspaper,
   faQuestion,
   faVideo
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Dashboard.css";
import { generateQuizQuestions } from "../../util/dashboard";
import CreateLearningTask from "./CreateLearningTask";
import EditProgressPopup from "./EditProgressPopup";
import QuizModal from "./QuizModal";
import Sidebar from "./Sidebar";

function Dashboard() {
   const [showCreateTask, setShowCreateTask] = useState(false);
   const [showEditPopup, setShowEditPopup] = useState(false);
   const [editingTask, setEditingTask] = useState(null);
   const [learningTasks, setLearningTasks] = useState([
      {
         id: 1,
         name: "Advance Node JS",
         level: "Advance",
         progress: 0,
         status: "Not Started",
         timeRemain: "30 Hrs",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [
            { name: "Basics", percentage: 25 },
            { name: "Advanced Concepts", percentage: 50 },
            { name: "Project Implementation", percentage: 75 },
            { name: "Testing and Deployment", percentage: 100 },
         ],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Course",
         estimatedTime: "20 hours",
         pages: 200,
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
      {
         id: 2,
         name: "AI Integration",
         level: "Intermediate",
         progress: 70,
         status: "In Progress",
         timeRemain: "6 Hrs",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Video",
         estimatedTime: "2 hours",
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
      {
         id: 3,
         name: "MERN Stack development",
         level: "Advance",
         progress: 10,
         status: "Paused",
         timeRemain: "2 Days",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Course",
         estimatedTime: "20 hours",
         pages: 200,
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
      {
         id: 4,
         name: "AI Integration",
         level: "Intermediate",
         progress: 100,
         status: "Completed",
         timeRemain: "2 days",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Video",
         estimatedTime: "2 hours",
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
      {
         id: 5,
         name: "MERN Stack development",
         level: "Advance",
         progress: 90,
         status: "In Progress",
         timeRemain: "12 Hrs",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Course",
         estimatedTime: "20 hours",
         pages: 200,
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
      {
         id: 6,
         name: "MERN Stack development",
         level: "Advance",
         progress: 30,
         status: "In Progress",
         timeRemain: "21 Hrs",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Course",
         estimatedTime: "20 hours",
         pages: 200,
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
      {
         id: 7,
         name: "Clean Code By Robert C. Martin",
         level: "Beginner",
         progress: 0,
         status: "Not Started",
         timeRemain: "30 Hrs",
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [],
         peerReviews: [],
         type: "Book",
         estimatedTime: "20 hours",
         pages: 200,
         chapters: 10,
         reminders: [],
         personalGoals: [],
         quizResults: [],
      },
   ]);

   const [showQuizModal, setShowQuizModal] = useState(false);
   const [currentQuiz, setCurrentQuiz] = useState(null);

   const showNotification = (message, type = "info") => {
      toast[type](message, {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
      });
   };

   const handleSubmit = (newTaskData) => {
      const newTask = {
         id: Date.now(),
         name: newTaskData.taskTitle,
         level: "Beginner", // You might want to add a field for this in CreateLearningTask
         progress: newTaskData.initialProgress || 0,
         status: newTaskData.initialProgress > 0 ? "In Progress" : "Not Started",
         timeRemain: `${newTaskData.completionDays} days`,
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [newTaskData.sourceLink],
         peerReviews: [],
         type: newTaskData.taskType,
         estimatedTime: newTaskData.estimatedTime,
         pages: newTaskData.pages,
         chapters: newTaskData.chapters,
         reminders: newTaskData.reminders,
         personalGoals: newTaskData.personalGoals,
      };
      setLearningTasks((prevTasks) => [...prevTasks, newTask]);
      setShowCreateTask(false);
      showNotification(`New task "${newTask.name}" created successfully!`, "success");
   };

   const handleEditClick = (task) => {
      setEditingTask(task);
      setShowEditPopup(true);
   };

   const triggerQuiz = async (task) => {
      try {
         const quizQuestions = await generateQuizQuestions(task.name);
         setCurrentQuiz({
            taskId: task.id,
            taskName: task.name,
            questions: quizQuestions,
         });
         setShowQuizModal(true);
      } catch (error) {
         console.error("Failed to generate quiz questions:", error);
         showNotification("Failed to generate quiz. Please try again later.", "error");
      }
   };

   const handleUpdateProgress = (taskId, taskSpecificProgress, notes, codeSnippet, resourceLink, timeSpent) => {
      const currentDate = new Date();
      setLearningTasks((prevTasks) =>
         prevTasks.map((task) => {
            if (task.id === taskId) {
               const newProgress = calculateProgress(task, taskSpecificProgress);
               const updatedTask = {
                  ...task,
                  progress: newProgress,
                  status: newProgress === 100 ? "Completed" : "In Progress",
                  lastUpdated: currentDate.toISOString(),
                  progressHistory: [...task.progressHistory, { date: currentDate.toISOString(), progress: newProgress, notes }],
                  timeSpent: task.timeSpent + timeSpent,
                  codeSnippets: codeSnippet ? [...task.codeSnippets, codeSnippet] : task.codeSnippets,
                  resourceLinks: resourceLink ? [...task.resourceLinks, resourceLink] : task.resourceLinks,
               };

               if (newProgress >= 50 && task.progress < 50) {
                  triggerQuiz(updatedTask);
               }

               return updatedTask;
            }
            return task;
         }),
      );
      setShowEditPopup(false);
   };

   const calculateProgress = (task, taskSpecificProgress) => {
      switch (task.type) {
         case "Book":
            return Math.min(100, (taskSpecificProgress / task.pages) * 100);
         case "Video":
            return Math.min(100, (taskSpecificProgress / parseTime(task.estimatedTime)) * 100);
         default:
            return Math.min(100, taskSpecificProgress);
      }
   };

   // Helper function to parse time strings like "2 hours 30 minutes" into minutes
   const parseTime = (timeString) => {
      const hours = timeString.match(/(\d+)\s*hour/);
      const minutes = timeString.match(/(\d+)\s*minute/);
      return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
   };

   const handleQuizComplete = (taskId, taskName, score) => {
      if (!currentQuiz) {
         console.error("No current quiz found");
         return;
      }

      const totalQuestions = currentQuiz.questions.length;
      const percentageScore = (score / totalQuestions) * 100;
      const passed = percentageScore >= 70; // 70% pass threshold

      showNotification(
         `You ${passed ? "passed" : "failed"} the quiz for ${taskName} with a score of ${percentageScore.toFixed(2)}%`,
         passed ? "success" : "warning",
      );

      if (passed) {
         setLearningTasks((prevTasks) =>
            prevTasks.map((t) =>
               t.id === taskId
                  ? { ...t, progress: Math.max(t.progress, 50) } // Ensure progress is at least 50%
                  : t,
            ),
         );
      }

      setShowQuizModal(false);
      setCurrentQuiz(null);
   };

   const getCourseIcon = (type) => {
      switch (type?.toLowerCase()) {
         case "book":
            return faBook;
         case "video":
            return faVideo;
         case "article":
            return faNewspaper;
         case "course":
            return faGraduationCap;
         default:
            return faQuestion;
      }
   };

   return (
      <div className='dashboard'>
         <ToastContainer />
         <div className='main-content'>
            <div className='hero-banner'>
               <div className='hero-content'>
                  <h2>Sharpen Your Coding Skills With Professional Online Courses</h2>
                  <button className='create-log-btn' onClick={() => setShowCreateTask(true)}>
                     Create Log Now <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  {showCreateTask && <CreateLearningTask onClose={() => setShowCreateTask(false)} handleSubmit={handleSubmit} />}
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
            <div className='learning-journey'>
               <div className='section-header'>
                  <h3>My Learning Journey</h3>
                  <a href='#'>View All</a>
               </div>
               <div className='learning-journey-content'>
                  {learningTasks.map((course) => (
                     <div key={course.id} className='course-card'>
                        <div className='course-card-header'>
                           <div className={`course-icon ${course.type ? course.type.toLowerCase() : "unknown"}`}>
                              <FontAwesomeIcon icon={getCourseIcon(course.type)} />
                           </div>
                           <div className='course-details'>
                              <h4>{course.name}</h4>
                              <span className='course-level'>{course.level}</span>
                           </div>
                           <button className='edit-progress-btn' onClick={() => handleEditClick(course)}>
                              <FontAwesomeIcon icon={faEdit} />
                           </button>
                        </div>
                        <div className='course-card-body'>
                           <div className='progress-container'>
                              <div className='progress-bar'>
                                 <div className='progress' style={{ width: `${Math.round(course.progress)}%` }}></div>
                              </div>
                              <span className='progress-text'>{Math.round(course.progress)}%</span>
                           </div>
                           <div className='course-meta'>
                              {course.type === "Book" && (
                                 <span className='course-pages'>
                                    <FontAwesomeIcon icon={faBook} /> {course.pages} pages
                                 </span>
                              )}
                              {course.type === "Video" && (
                                 <span className='course-duration'>
                                    <FontAwesomeIcon icon={faVideo} /> {course.estimatedTime}
                                 </span>
                              )}
                              <span className='time-remain'>
                                 <FontAwesomeIcon icon={faClock} /> {course.timeRemain}
                              </span>
                           </div>
                        </div>
                        <div className='course-card-footer'>
                           <span className={`status ${course.status.toLowerCase().replace(" ", "-")}`}>{course.status}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <Sidebar />

         {showEditPopup && (
            <EditProgressPopup task={editingTask} onUpdateProgress={handleUpdateProgress} onClose={() => setShowEditPopup(false)} />
         )}
         {showQuizModal && currentQuiz && (
            <QuizModal
               quiz={currentQuiz}
               onClose={() => setShowQuizModal(false)}
               onQuizComplete={handleQuizComplete}
               showNotification={showNotification}
            />
         )}
      </div>
   );
}

export default Dashboard;
