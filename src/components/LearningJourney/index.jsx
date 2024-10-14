import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
   addJourneyToUser,
   setSelectedJourneyToUser,
   updateJourneyToUser,
   deleteJourneyFromUser,
} from "../../redux/learningJourney/learningJourneyHandle";
import styles from "./LearningJourney.module.css";
import { FaBook, FaYoutube, FaGraduationCap, FaLink, FaPlus, FaTimes, FaCheck, FaTrash } from "react-icons/fa";

const LearningJourney = () => {
   const dispatch = useDispatch();
   const { journeys, selectedJourney } = useSelector((state) => state.learningJourney);
   const [isCreatingJourney, setIsCreatingJourney] = useState(false);
   const [newJourneyName, setNewJourneyName] = useState("");
   const [progress, setProgress] = useState(0);

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
      }
   }, [selectedJourney]);

   const createNewJourney = (e) => {
      e.preventDefault();
      const newJourney = {
         id: Date.now(),
         name: newJourneyName,
         resources: [],
         steps: [],
         notes: "",
         tasks: [],
      };
      dispatch(addJourneyToUser(newJourney));
      setNewJourneyName("");
      setIsCreatingJourney(false);
      dispatch(setSelectedJourneyToUser(newJourney));
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

   const updateNotes = (e) => {
      const updatedJourney = {
         ...selectedJourney,
         notes: e.target.value,
      };
      dispatch(updateJourneyToUser(updatedJourney));
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
      }
   };

   const renderStepContent = (step) => {
      const content = step.split(":").slice(1).join(":");
      const urlRegex = /https?:\/\/\S+/g;
      const urls = content.match(urlRegex) || [];

      if (urls.length === 0) {
         return content;
      }

      return urls.map((url, i) => (
         <React.Fragment key={i}>
            {i > 0 && " "}
            <a href={url} target='_blank' rel='noopener noreferrer'>
               {url}
            </a>
         </React.Fragment>
      ));
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
                     <div key={journey.id} className={styles.journeyItem} onClick={() => dispatch(setSelectedJourneyToUser(journey))}>
                        <h3 className={styles.sectionTitle}>{journey.name}</h3>
                        <p>
                           {journey.resources.length} resources • {journey.tasks.length} tasks
                        </p>
                        <button className={styles.deleteButton} onClick={(e) => handleDeleteJourney(e, journey.id)}>
                           <FaTrash />
                        </button>
                     </div>
                  ))}
               </div>
               {isCreatingJourney && (
                  <div className={styles.modalOverlay}>
                     <div className={styles.modal}>
                        <h3 className={styles.sectionTitle}>Create New Journey</h3>
                        <FaTimes className={styles.closeIcon} onClick={() => setIsCreatingJourney(false)} />
                        <form onSubmit={createNewJourney} className={styles.formContainer}>
                           <input
                              type='text'
                              value={newJourneyName}
                              onChange={(e) => setNewJourneyName(e.target.value)}
                              placeholder='Enter journey name'
                              required
                              className={styles.inputField}
                           />
                           <button type='submit' className={styles.addButton}>
                              Create Journey
                           </button>
                        </form>
                     </div>
                  </div>
               )}
            </div>
         ) : (
            <div className={styles.journeyDetails}>
               <h2>{selectedJourney.name}</h2>
               <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
               </div>
               <div className={styles.progressText}>{`${Math.round(progress)}% Complete`}</div>
               <div className={styles.journeyContent}>
                  <div className={styles.leftPanel}>
                     <div className={styles.resourcesPanel}>
                        <h3 className={styles.sectionTitle}>Resources</h3>
                        <form onSubmit={addResource} className={styles.formContainer}>
                           <input type='url' name='resource' placeholder='Add a resource link' className={styles.inputField} required />
                           <button type='submit' className={styles.addButton}>
                              Add
                           </button>
                        </form>
                        <ul className={styles.resourceList}>
                           {selectedJourney.resources.map((resource, index) => (
                              <li key={index} className={styles.resourceItem}>
                                 <input
                                    type='checkbox'
                                    checked={resource.completed}
                                    onChange={() => toggleResourceCompletion(index)}
                                    className={styles.resourceCheckbox}
                                 />
                                 <span className={styles.resourceIcon}>{getResourceIcon(resource.type)}</span>
                                 <a
                                    href={resource.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={`${styles.resourceLink} ${resource.completed ? styles.resourceCompleted : ""}`}>
                                    {resource.url}
                                 </a>
                                 {resource.completed && <FaCheck className={styles.completedIcon} />}
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className={styles.tasksPanel}>
                        <h3 className={styles.sectionTitle}>Tasks</h3>
                        <form onSubmit={addTask} className={styles.formContainer}>
                           <input type='text' name='task' placeholder='Add a new task' className={styles.inputField} required />
                           <button type='submit' className={styles.addButton}>
                              Add
                           </button>
                        </form>
                        <ul className={styles.taskList}>
                           {selectedJourney.tasks.map((task, index) => (
                              <li key={index} className={styles.taskItem}>
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
                                 <span className={task.completed ? styles.completedTask : ""}>{task.text}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
                  <div className={styles.rightPanel}>
                     <div className={styles.journeyMapPanel}>
                        <h3 className={styles.sectionTitle}>Journey Map</h3>
                        <div className={styles.journeyMap}>
                           {selectedJourney.steps.map((step, index) => (
                              <div key={index} className={styles.journeyStep}>
                                 <div className={styles.stepNumber}>{index + 1}</div>
                                 <div className={styles.stepContent}>
                                    <h4>{step.split(":")[0]}</h4>
                                    <p>{renderStepContent(step)}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className={styles.notesPanel}>
                        <h3 className={styles.sectionTitle}>Notes</h3>
                        <textarea
                           value={selectedJourney.notes}
                           onChange={updateNotes}
                           placeholder='Add your notes here...'
                           className={styles.notesTextarea}
                        />
                     </div>
                  </div>
               </div>
               <button onClick={() => dispatch(setSelectedJourneyToUser(null))} className={styles.backButton}>
                  Back to Journeys
               </button>
            </div>
         )}
      </div>
   );
};

export default LearningJourney;
