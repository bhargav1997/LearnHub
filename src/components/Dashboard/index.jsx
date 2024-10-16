import {
   faBook,
   faChevronRight,
   faClock,
   faEdit,
   faGraduationCap,
   faNewspaper,
   faQuestion,
   faVideo,
   faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Dashboard.css";
import { generateQuizQuestions } from "../../util/dashboard";
import CreateLearningTask from "./CreateLearningTask";
import EditProgressPopup from "./EditProgressPopup";
import QuizModal from "./QuizModal";
import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import { addLearningTask } from "../../redux/task/learningTaskSlice";
// import { useSelector } from "react-redux";
import axios from "axios";
import { CONFIG } from "../../config";
import { faBookOpen, faRocket, faStar } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
   const [showCreateTask, setShowCreateTask] = useState(false);
   const [showEditPopup, setShowEditPopup] = useState(false);
   const [editingTask, setEditingTask] = useState(null);
   const [apiLearningTasks, setApiLearningTasks] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   // const { user } = useSelector((state) => state.user);
   const API_URL = CONFIG.API_URL;

   // Add these state variables to track the stats
   const [enrolledCourses, setEnrolledCourses] = useState(0);
   const [totalLessons, setTotalLessons] = useState(0);
   const [earnedCertificates, setEarnedCertificates] = useState(0);

   // const [mockLearningTasks, setMockLearningTasks] = useState([
   //    {
   //       id: 1,
   //       name: "Advance Node JS",
   //       level: "Advance",
   //       progress: 0,
   //       status: "Not Started",
   //       timeRemain: "30 Hrs",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [
   //          { name: "Basics", percentage: 25 },
   //          { name: "Advanced Concepts", percentage: 50 },
   //          { name: "Project Implementation", percentage: 75 },
   //          { name: "Testing and Deployment", percentage: 100 },
   //       ],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Course",
   //       estimatedTime: "20 hours",
   //       pages: 200,
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   //    {
   //       id: 2,
   //       name: "AI Integration",
   //       level: "Intermediate",
   //       progress: 70,
   //       status: "In Progress",
   //       timeRemain: "6 Hrs",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Video",
   //       estimatedTime: "2 hours",
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   //    {
   //       id: 3,
   //       name: "MERN Stack development",
   //       level: "Advance",
   //       progress: 10,
   //       status: "Paused",
   //       timeRemain: "2 Days",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Course",
   //       estimatedTime: "20 hours",
   //       pages: 200,
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   //    {
   //       id: 4,
   //       name: "AI Integration",
   //       level: "Intermediate",
   //       progress: 100,
   //       status: "Completed",
   //       timeRemain: "2 days",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Video",
   //       estimatedTime: "2 hours",
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   //    {
   //       id: 5,
   //       name: "MERN Stack development",
   //       level: "Advance",
   //       progress: 90,
   //       status: "In Progress",
   //       timeRemain: "12 Hrs",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Course",
   //       estimatedTime: "20 hours",
   //       pages: 200,
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   //    {
   //       id: 6,
   //       name: "MERN Stack development",
   //       level: "Advance",
   //       progress: 30,
   //       status: "In Progress",
   //       timeRemain: "21 Hrs",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Course",
   //       estimatedTime: "20 hours",
   //       pages: 200,
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   //    {
   //       id: 7,
   //       name: "Clean Code By Robert C. Martin",
   //       level: "Beginner",
   //       progress: 0,
   //       status: "Not Started",
   //       timeRemain: "30 Hrs",
   //       lastUpdated: new Date().toISOString(),
   //       progressHistory: [],
   //       milestones: [],
   //       timeSpent: 0,
   //       codeSnippets: [],
   //       resourceLinks: [],
   //       peerReviews: [],
   //       type: "Book",
   //       estimatedTime: "20 hours",
   //       pages: 200,
   //       chapters: 10,
   //       reminders: [],
   //       personalGoals: [],
   //       quizResults: [],
   //    },
   // ]);

   const [showQuizModal, setShowQuizModal] = useState(false);
   const [currentQuiz, setCurrentQuiz] = useState(null);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [taskToDelete, setTaskToDelete] = useState(null);

   const dispatch = useDispatch();

   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/tasks/learning-tasks`, {
               headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.status !== 200) {
               toast.error("Failed to retrieve learning tasks, please try again later.");
               return;
            }

            setApiLearningTasks(response.data);

            // Calculate stats based on the fetched data
            setEnrolledCourses(response.data.length);
            setTotalLessons(response.data.reduce((total, task) => total + (task.chapters || 0), 0));
            setEarnedCertificates(response.data.filter((task) => task.status === "Completed").length);
         } catch (error) {
            console.error("Error fetching learning tasks:", error);
            toast.error("Failed to fetch learning tasks. Please try again.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, [API_URL]);

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

   const handleSubmit = async (newTaskData) => {
      const newTask = {
         id: Date.now(),
         taskType: newTaskData?.taskType,
         taskTitle: newTaskData?.taskTitle,
         level: "Beginner", // You might want to add a field for this in CreateLearningTask
         progress: newTaskData?.initialProgress || 0,
         status: newTaskData?.initialProgress > 0 ? "In Progress" : "Not Started",
         timeRemain: `${newTaskData?.completionDays} days`,
         lastUpdated: new Date().toISOString(),
         progressHistory: [],
         milestones: [],
         timeSpent: 0,
         codeSnippets: [],
         resourceLinks: [newTaskData?.sourceLink],
         peerReviews: [],
         type: newTaskData?.taskType,
         estimatedTime: newTaskData.estimatedTime ? newTaskData.estimatedTime : newTaskData.timeRemain,
         pages: newTaskData?.pages,
         chapters: newTaskData?.chapters,
         reminders: newTaskData?.reminders,
         personalGoals: newTaskData?.personalGoals,
      };
      try {
         await dispatch(addLearningTask(newTask)).unwrap();
         // setMockLearningTasks((prevTasks) => [...prevTasks, newTask]);
         setApiLearningTasks((prevTasks) => [...prevTasks, newTask]);

         setShowCreateTask(false);
         showNotification(`New task "${newTask.taskTitle}" created successfully!`, "success");
      } catch (error) {
         console.error("Failed to create task:", error);
         toast.error("Failed to create task: Please try again later.");
      }
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

   // const isMoreThanSixDaysOld = (dateString) => {
   //    const date = new Date(dateString);
   //    const now = new Date();
   //    const diffTime = Math.abs(now - date);
   //    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   //    return diffDays > 6;
   // };

   const handleUpdateProgress = (taskId, taskSpecificProgress, notes, codeSnippet, resourceLink, timeSpent) => {
      const currentDate = new Date();
      let updatedTasks = apiLearningTasks.map((task) => {
         if (task.id === taskId) {
            const newProgress = calculateProgress(task, taskSpecificProgress);
            const updatedTask = {
               ...task,
               progress: newProgress,
               status: newProgress === 100 ? "Completed" : task.status === "Paused" ? "In Progress" : task.status,
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
      });
      setApiLearningTasks(updatedTasks);
      // setMockLearningTasks(updatedTasks);
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
         setApiLearningTasks((prevTasks) =>
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

   const learningTasks = apiLearningTasks.length > 0 ? apiLearningTasks : [];

   const handleDeleteTask = async (taskId) => {
      try {
         const token = localStorage.getItem("token");
         const config = {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         };

         // Check if it's a real task (not dummy data)
         const isRealTask = apiLearningTasks.some((task) => task.id === taskId);

         if (isRealTask) {
            await axios.delete(`${API_URL}/tasks/learning-tasks/${taskId}`, config);
         }

         // Remove the task from both apiLearningTasks and mockLearningTasks
         setApiLearningTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
         // setMockLearningTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

         showNotification("Task deleted successfully", "success");
      } catch (error) {
         console.error("Failed to delete task:", error);
         showNotification("Failed to delete task. Please try again.", "error");
      }
   };

   const handleDeleteClick = (task) => {
      setTaskToDelete(task);
      setShowDeleteConfirmation(true);
   };

   const confirmDelete = async () => {
      if (taskToDelete) {
         await handleDeleteTask(taskToDelete.id);
         setShowDeleteConfirmation(false);
         setTaskToDelete(null);
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
                  <h3>{enrolledCourses}</h3>
                  <p>Enrolled Course{enrolledCourses !== 1 ? "s" : ""}</p>
                  <a href='#'>
                     View Details <FontAwesomeIcon icon={faChevronRight} />
                  </a>
               </div>
               <div className='stat-card'>
                  <h3>{totalLessons}</h3>
                  <p>Lesson{totalLessons !== 1 ? "s" : ""}</p>
                  <a href='#'>
                     View Details <FontAwesomeIcon icon={faChevronRight} />
                  </a>
               </div>
               <div className='stat-card'>
                  <h3>{earnedCertificates}</h3>
                  <p>Certificate{earnedCertificates !== 1 ? "s" : ""}</p>
                  <a href='#'>
                     View Details <FontAwesomeIcon icon={faChevronRight} />
                  </a>
               </div>
            </div>
            <div className='learning-journey'>
               <div className='section-header'>
                  <h3>My Learning Journey</h3>
                  {learningTasks.length > 0 && <a href='#'>View All</a>}
               </div>
               <>
                  {isLoading ? (
                     <div>Loading...</div>
                  ) : learningTasks.length > 0 ? (
                     <div className='learning-journey-content'>
                        {learningTasks.map((task) => (
                           <div key={task.id} className='course-card'>
                              <div className='course-card-header'>
                                 <div className={`course-icon ${task.type ? task.type.toLowerCase() : "unknown"}`}>
                                    <FontAwesomeIcon icon={getCourseIcon(task.type)} />
                                 </div>
                                 <div className='course-details'>
                                    <h4>{task.name}</h4>
                                    <span className='course-level'>{task.level}</span>
                                 </div>
                                 <button className='edit-progress-btn' onClick={() => handleEditClick(task)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                 </button>
                                 <button className='delete-task-btn' onClick={() => handleDeleteClick(task)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                 </button>
                              </div>
                              <div className='course-card-body'>
                                 <div className='progress-container'>
                                    <div className='progress-bar'>
                                       <div className='progress' style={{ width: `${Math.round(task.progress)}%` }}></div>
                                    </div>
                                    <span className='progress-text'>{Math.round(task.progress)}%</span>
                                 </div>
                                 <div className='course-meta'>
                                    {task.type === "Book" && (
                                       <span className='course-pages'>
                                          <FontAwesomeIcon icon={faBook} /> {task.pages} pages
                                       </span>
                                    )}
                                    {task.type === "Video" && (
                                       <span className='course-duration'>
                                          <FontAwesomeIcon icon={faVideo} /> {task.estimatedTime}
                                       </span>
                                    )}
                                    <span className='time-remain'>
                                       <FontAwesomeIcon icon={faClock} /> {task.timeRemain}
                                    </span>
                                 </div>
                              </div>
                              <div className='course-card-footer'>
                                 <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className='empty-state'>
                        <div className='empty-state-icons'>
                           <FontAwesomeIcon icon={faBookOpen} className='icon-book' />
                           <FontAwesomeIcon icon={faRocket} className='icon-rocket' />
                           <FontAwesomeIcon icon={faStar} className='icon-star' />
                        </div>
                        <h3>Your Learning Adventure Begins Here!</h3>
                        <p>Ready to start your learning journey? Create your first learning task and let&apos;s get started!</p>
                        <button className='create-task-btn' onClick={() => setShowCreateTask(true)}>
                           Create Your First Task
                        </button>
                     </div>
                  )}
               </>
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
         {showDeleteConfirmation && (
            <div className='delete-confirmation-overlay'>
               <div className='delete-confirmation-modal'>
                  <p>Are you sure you want to delete this task?</p>
                  <button onClick={confirmDelete}>Yes, delete</button>
                  <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
               </div>
            </div>
         )}
      </div>
   );
}

export default Dashboard;
