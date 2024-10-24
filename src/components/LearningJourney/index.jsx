import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
   addJourneyToUser,
   setSelectedJourneyToUser,
   updateJourneyToUser,
   deleteJourneyFromUser,
   getJourneysToUser,
} from "../../redux/learningJourney/learningJourneyHandle";
import styles from "./LearningJourney.module.css";
import {
   FaBook,
   FaYoutube,
   FaGraduationCap,
   FaLink,
   FaPlus,
   FaTimes,
   FaCheck,
   FaTrash,
   FaRocket,
   FaStar,
   FaSpaceShuttle,
   FaArrowLeft,
   FaTasks,
   FaMap,
   FaStickyNote,
   FaChevronDown,
   FaChevronUp,
   FaShare,
} from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";
import ShareJourney from "./ShareJourney";
import { debounce } from "lodash";

// If you don't want to use lodash, you can implement a simple debounce function:
// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

const ResourceItem = ({ resource, index, toggleResourceCompletion, deleteResource }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const maxLength = 50; // Adjust this value to change when "Read More" appears
   const toggleExpand = (e) => {
      e.preventDefault();
      setIsExpanded(!isExpanded);
   };

   const getResourceIcon = (type) => {
      switch (type.toLowerCase()) {
         case "udemy":
            return <FaGraduationCap />;
         case "khan academy":
            return <FaBook />;
         case "youtube":
            return <FaYoutube />;
         case "coursera":
            return <FaGraduationCap />;
         default:
            return <FaLink />;
      }
   };

   const displayUrl = isExpanded ? resource.url : resource.url.slice(0, maxLength);

   return (
      <li className={`${styles.resourceItem} ${resource.completed ? styles.completed : ""}`}>
         <input type='checkbox' checked={resource.completed} onChange={() => toggleResourceCompletion(index)} />
         <span className={styles.resourceIcon}>{getResourceIcon(resource.type)}</span>
         <a href={resource.url} target='_blank' rel='noopener noreferrer' className={styles.resourceLink}>
            {displayUrl}
            {!isExpanded && resource.url.length > maxLength && "..."}
         </a>
         {resource.url.length > maxLength && (
            <button onClick={toggleExpand} className={styles.readMoreButton}>
               {isExpanded ? "Read Less" : "Read More"}
            </button>
         )}
         <div className={styles.resourceActions}>
            {resource.completed && <FaCheck className={styles.completedIcon} />}
            <button onClick={() => deleteResource(resource._id)} className={styles.trashButton}>
               <FaTrash />
            </button>
         </div>
      </li>
   );
};

const JourneyStep = ({ step, index }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const maxLength = 100; // Adjust this value to change when "Read More" appears

   const toggleExpand = () => {
      setIsExpanded(!isExpanded);
   };

   const renderStepContent = (content) => {
      const urlRegex = /\b(?!\d+\.)\S+\.\S+\b/g;
      const urls = content.match(urlRegex) || [];

      if (urls.length === 0) {
         return content;
      }

      return content.split(urlRegex).map((text, i) => (
         <React.Fragment key={i}>
            {text}
            {urls[i] && (
               <a
                  href={urls[i].startsWith("http") ? urls[i] : `http://${urls[i]}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.stepLink}>
                  {urls[i]}
               </a>
            )}
         </React.Fragment>
      ));
   };

   const [stepType, ...stepContentArray] = step.split(":");
   const stepContent = stepContentArray.join(":");
   const displayContent = isExpanded ? stepContent : stepContent.slice(0, maxLength);
   const isLongContent = stepContent.length > maxLength;

   return (
      <div className={styles.journeyStep}>
         <div className={styles.stepNumber}>{index + 1}</div>
         <div className={styles.stepContent}>
            <h4>{stepType}</h4>
            <p>
               {renderStepContent(displayContent)}
               {!isExpanded && isLongContent && "..."}
            </p>
            {isLongContent && (
               <button onClick={toggleExpand} className={styles.readMoreButton}>
                  {isExpanded ? (
                     <>
                        Read Less <FaChevronUp />
                     </>
                  ) : (
                     <>
                        Read More <FaChevronDown />
                     </>
                  )}
               </button>
            )}
         </div>
      </div>
   );
};

const LearningJourney = () => {
   const dispatch = useDispatch();
   const { journeys, selectedJourney } = useSelector((state) => state.learningJourney);
   const [isCreatingJourney, setIsCreatingJourney] = useState(false);
   const [newJourneyName, setNewJourneyName] = useState("");
   const [progress, setProgress] = useState(0);
   const [sharingJourneyId, setSharingJourneyId] = useState(null);
   const [localNotes, setLocalNotes] = useState(selectedJourney?.notes || "");

   const calculateProgress = () => {
      const totalItems = selectedJourney.resources.length + selectedJourney.tasks.length;
      const completedItems =
         selectedJourney.resources.filter((r) => r.completed).length + selectedJourney.tasks.filter((t) => t.completed).length;
      const newProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
      setProgress(newProgress);
   };

   useEffect(() => {
      if (selectedJourney) {
         calculateProgress();
         setLocalNotes(selectedJourney.notes || "");
      }
   }, [selectedJourney]);

   useEffect(() => {
      dispatch(getJourneysToUser());
   }, [dispatch]);

   const createNewJourney = (e) => {
      e.preventDefault();
      const newJourney = {
         name: newJourneyName,
         resources: [],
         steps: [],
         notes: "",
         tasks: [],
      };
      dispatch(addJourneyToUser(newJourney));
      setNewJourneyName("");
      setIsCreatingJourney(false);
   };

   const addResource = (e) => {
      e.preventDefault();
      const newResource = e.target.resource.value;
      const resourceType = getResourceType(newResource);
      const updatedJourney = {
         ...selectedJourney,
         resources: [...selectedJourney.resources, { url: newResource, type: resourceType, completed: false }],
         steps: [...selectedJourney.steps, `Explore ${resourceType} resource: ${newResource}`],
      };
      dispatch(updateJourneyToUser(updatedJourney));
      e.target.resource.value = "";
   };

   const getResourceType = (url) => {
      if (url.includes("udemy.com")) return "Udemy";
      if (url.includes("khanacademy.org")) return "Khan Academy";
      if (url.includes("youtube.com")) return "YouTube";
      if (url.includes("coursera.org")) return "Coursera";
      return "Other";
   };

   const addTask = (e) => {
      e.preventDefault();
      const newTask = e.target.task.value;
      const updatedJourney = {
         ...selectedJourney,
         tasks: [...selectedJourney.tasks, { text: newTask, completed: false }],
      };
      dispatch(updateJourneyToUser(updatedJourney));
      e.target.task.value = "";
   };

   const debouncedUpdateNotes = useCallback(
     debounce((notes) => {
       const updatedJourney = {
         ...selectedJourney,
         notes: notes,
       };
       dispatch(updateJourneyToUser(updatedJourney));
     }, 500),
     [selectedJourney]
   );

   const updateNotes = (e) => {
     const newNotes = e.target.value;
     setLocalNotes(newNotes);
     debouncedUpdateNotes(newNotes);
   };

   const toggleResourceCompletion = (index) => {
      const updatedResources = selectedJourney.resources.map((resource, i) =>
         i === index ? { ...resource, completed: !resource.completed } : resource,
      );
      const updatedJourney = { ...selectedJourney, resources: updatedResources };
      dispatch(updateJourneyToUser(updatedJourney));
   };

   const handleDeleteJourney = (e, journeyId) => {
      e.stopPropagation(); // Prevent the journey from being selected when deleting
      if (window.confirm("Are you sure you want to delete this journey?")) {
         dispatch(deleteJourneyFromUser(journeyId));
         dispatch(getJourneysToUser());
      }
   };

   const deleteResource = async (resourceId) => {
      if (!window.confirm("Are you sure you want to delete this resource?")) {
         return;
      }

      try {
         const response = await axios.delete(`${CONFIG.API_URL}/learning-journeys/${selectedJourney._id}/resources/${resourceId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });

         if (response.status === 200 && response.data) {
            dispatch(updateJourneyToUser(response.data));
            toast.success("Resource deleted successfully");
         } else {
            toast.error("Unexpected response from server");
         }
      } catch (error) {
         toast.error("Failed to delete resource: " + (error.response?.data?.message || error.message));
      }
   };

   const deleteTask = async (taskId) => {
      if (!window.confirm("Are you sure you want to delete this task?")) {
         return;
      }

      try {
         const response = await axios.delete(`${CONFIG.API_URL}/learning-journeys/${selectedJourney._id}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });

         if (response.status === 200 && response.data) {
            dispatch(updateJourneyToUser(response.data));
            toast.success("Task deleted successfully");
         } else {
            toast.error("Unexpected response from server");
         }
      } catch (error) {
         toast.error("Failed to delete task: " + (error.response?.data?.message || error.message));
      }
   };

   const handleShareJourney = (e, journeyId) => {
      e.stopPropagation();
      setSharingJourneyId(journeyId);
   };

   return (
      <div className={styles.learningJourneyContainer}>
         <h2 className={styles.journeyTitle}>Your Learning Journeys</h2>
         {!selectedJourney ? (
            <div className={styles.journeyList}>
               <div className={styles.journeyGrid}>
                  <div className={styles.newJourneyItem} onClick={() => setIsCreatingJourney(true)}>
                     <FaPlus />
                     <p>Create New Journey</p>
                  </div>
                  {journeys.map((journey) => (
                     <div key={journey._id} className={styles.journeyItem}>
                        <div className={styles.journeyActions}>
                           <button className={styles.shareButton} onClick={(e) => handleShareJourney(e, journey._id)}>
                              <FaShare />
                           </button>
                           <button className={styles.deleteButton} onClick={(e) => handleDeleteJourney(e, journey._id)}>
                              <FaTrash />
                           </button>
                        </div>
                        <div className={styles.journeyItemContent} onClick={() => dispatch(setSelectedJourneyToUser(journey._id))}>
                           <h3 className={styles.sectionTitle}>{journey.name}</h3>
                           <p>
                              {journey.resources.length} resources • {journey.tasks.length} tasks
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
               {isCreatingJourney && (
                  <div className={styles.modalOverlay}>
                     <div className={styles.modal}>
                        <div className={styles.modalContent}>
                           <div className={styles.modalHeader}>
                              <h3 className={styles.modalTitle}>Embark on a New Learning Adventure</h3>
                              <button className={styles.closeButton} onClick={() => setIsCreatingJourney(false)}>
                                 <FaTimes />
                              </button>
                           </div>
                           <div className={styles.modalBody}>
                              <div className={styles.modalIllustration}>
                                 <FaRocket className={styles.rocketIcon} />
                                 <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                       <FaStar key={i} className={styles.starIcon} />
                                    ))}
                                 </div>
                              </div>
                              <p className={styles.modalDescription}>Give your new learning journey a name and prepare for takeoff!</p>
                              <form onSubmit={createNewJourney} className={styles.journeyForm}>
                                 <input
                                    type='text'
                                    value={newJourneyName}
                                    onChange={(e) => setNewJourneyName(e.target.value)}
                                    placeholder='Enter your journey name'
                                    required
                                    className={styles.journeyInput}
                                 />
                                 <button type='submit' className={styles.createButton}>
                                    <FaSpaceShuttle className={styles.shuttleIcon} />
                                    Launch Journey
                                 </button>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         ) : (
            <div className={styles.journeyDetails}>
               <header className={styles.journeyHeader}>
                  <h2>{selectedJourney.name}</h2>
                  <button onClick={() => dispatch(setSelectedJourneyToUser(null))} className={styles.backButton}>
                     <FaArrowLeft /> Back to Journeys
                  </button>
               </header>

               <div className={styles.progressSection}>
                  <div className={styles.progressBarContainer}>
                     <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className={styles.progressText}>{`${Math.round(progress)}% Complete`}</div>
               </div>

               <div className={styles.journeyContent}>
                  <div className={styles.mainPanel}>
                     <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                           <FaBook /> Resources
                        </h3>
                        <form onSubmit={addResource} className={styles.addForm}>
                           <input type='url' name='resource' placeholder='Add a resource link' required />
                           <button type='submit'>
                              <FaPlus />
                           </button>
                        </form>
                        <ul className={styles.resourceList}>
                           {selectedJourney.resources.map((resource, index) => (
                              <ResourceItem
                                 key={index}
                                 resource={resource}
                                 index={index}
                                 toggleResourceCompletion={toggleResourceCompletion}
                                 deleteResource={deleteResource}
                              />
                           ))}
                        </ul>
                     </div>

                     <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                           <FaTasks /> Tasks
                        </h3>
                        <form onSubmit={addTask} className={styles.addForm}>
                           <input type='text' name='task' placeholder='Add a new task' required />
                           <button type='submit'>
                              <FaPlus />
                           </button>
                        </form>
                        <ul className={styles.taskList}>
                           {selectedJourney.tasks.map((task, index) => (
                              <li key={index} className={`${styles.taskItem} ${task.completed ? styles.completed : ""}`}>
                                 <input
                                    type='checkbox'
                                    checked={task.completed}
                                    onChange={() => {
                                       const updatedJourney = {
                                          ...selectedJourney,
                                          tasks: selectedJourney.tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)),
                                       };
                                       dispatch(updateJourneyToUser(updatedJourney));
                                    }}
                                 />
                                 <span>{task.text}</span>
                                 <div className={styles.taskActions}>
                                    <button onClick={() => deleteTask(task._id)} className={styles.trashButton}>
                                       <FaTrash />
                                    </button>
                                 </div>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  <div className={styles.sidePanel}>
                     <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                           <FaMap /> Journey Map
                        </h3>
                        <div className={styles.journeyMap}>
                           {selectedJourney.steps.map((step, index) => (
                              <JourneyStep key={index} step={step} index={index} />
                           ))}
                        </div>
                     </div>

                     <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                           <FaStickyNote /> Notes
                        </h3>
                        <textarea
                           value={localNotes}
                           onChange={updateNotes}
                           placeholder='Add your notes here...'
                           className={styles.notesTextarea}
                        />
                     </div>
                  </div>
               </div>
            </div>
         )}
         {sharingJourneyId && <ShareJourney journeyId={sharingJourneyId} onClose={() => setSharingJourneyId(null)} />}
      </div>
   );
};

ResourceItem.propTypes = {
   resource: PropTypes.object.isRequired,
   index: PropTypes.number.isRequired,
   toggleResourceCompletion: PropTypes.func.isRequired,
   deleteResource: PropTypes.func.isRequired,
};

JourneyStep.propTypes = {
   step: PropTypes.string.isRequired,
   index: PropTypes.number.isRequired,
};

export default LearningJourney;
