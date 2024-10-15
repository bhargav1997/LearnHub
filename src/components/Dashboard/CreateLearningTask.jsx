import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./CreateLearningTask.module.css";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

function CreateLearningTask({ onClose, handleSubmit }) {
   const [taskType, setTaskType] = useState("Course");
   const [taskTitle, setTaskTitle] = useState("");
   const [sourceLink, setSourceLink] = useState("");
   const [estimatedTime, setEstimatedTime] = useState("");
   const [completionDays, setCompletionDays] = useState("");
   const [pages, setPages] = useState("");
   const [chapters, setChapters] = useState("");
   const [reminders, setReminders] = useState({
      resume: false,
      deadline: false,
      every3Hours: false,
   });
   const [personalGoals, setPersonalGoals] = useState("");
   const [initialProgress, setInitialProgress] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
   useEffect(() => {
      // Reset fields when task type changes
      setEstimatedTime("");
      setPages("");
      setChapters("");
   }, [taskType]);

   const handleSubmitData = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Base task object with common fields
      let newTask = {
         taskType,
         taskTitle,
         sourceLink,
         completionDays,
         reminders,
         personalGoals,
         initialProgress,
      };

      // Add type-specific fields
      switch (taskType) {
         case "Book":
            newTask = {
               ...newTask,
               pages: parseInt(pages),
               chapters: parseInt(chapters),
            };
            break;
         case "Video":
         case "Article":
            newTask = {
               ...newTask,
               estimatedTime,
            };
            break;
         case "Course":
            newTask = {
               ...newTask,
               estimatedTime,
               chapters: parseInt(chapters), // Add this if courses have chapters
            };
            break;
      }

      try {
         await handleSubmit(newTask);
         onClose();
      } catch (error) {
         console.log("error", error);
         toast.error("Failed to create task: Please try again later.");
      } finally {
         setIsSubmitting(false);
      }
   };

   const renderContentSpecificFields = () => {
      switch (taskType) {
         case "Book":
            return (
               <>
                  <div className={styles.formGroup}>
                     <label htmlFor='pages'>Total Pages</label>
                     <input
                        type='number'
                        id='pages'
                        placeholder='Enter total pages'
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        required
                     />
                  </div>
                  <div className={styles.formGroup}>
                     <label htmlFor='chapters'>Total Chapters</label>
                     <input
                        type='number'
                        id='chapters'
                        placeholder='Enter total chapters'
                        value={chapters}
                        onChange={(e) => setChapters(e.target.value)}
                        required
                     />
                  </div>
               </>
            );
         case "Video":
         case "Article":
         case "Course":
            return (
               <div className={styles.formGroup}>
                  <label htmlFor='estimatedTime'>{`${
                     taskType === "Video"
                        ? "Video Duration"
                        : taskType === "Article"
                        ? "Estimated Reading Time"
                        : "Estimated Course Duration"
                  }`}</label>
                  <input
                     type='text'
                     id='estimatedTime'
                     placeholder={`e.g. ${
                        taskType === "Video" ? "2 hours 30 minutes" : taskType === "Article" ? "15 minutes" : "10 hours"
                     }`}
                     value={estimatedTime}
                     onChange={(e) => setEstimatedTime(e.target.value)}
                     required
                  />
               </div>
            );
         default:
            return null;
      }
   };

   return (
      <div className={styles.overlay}>
         <div className={styles.popup}>
            <h2>Create New Learning Task</h2>
            <button className={styles.closeButton} onClick={onClose}>
               <FontAwesomeIcon icon={faTimes} />
            </button>
            <form onSubmit={handleSubmitData}>
               <div className={styles.formGroup}>
                  <label htmlFor='taskType'>Type of the Content</label>
                  <select id='taskType' value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                     <option value='Course'>Course</option>
                     <option value='Book'>Book</option>
                     <option value='Video'>Video</option>
                     <option value='Article'>Article</option>
                  </select>
               </div>
               <div className={styles.formGroup}>
                  <label htmlFor='taskTitle'>Learning task title</label>
                  <input
                     type='text'
                     id='taskTitle'
                     placeholder={`e.g. ${taskType === "Book" ? "Clean Code by Robert C. Martin" : "React Master course"}`}
                     value={taskTitle}
                     onChange={(e) => setTaskTitle(e.target.value)}
                  />
                  <small>In Words only..</small>
               </div>
               <div className={styles.formGroup}>
                  <label htmlFor='sourceLink'>Source Link</label>
                  <input
                     type='text'
                     id='sourceLink'
                     placeholder={`${taskType} Link`}
                     value={sourceLink}
                     onChange={(e) => setSourceLink(e.target.value)}
                  />
               </div>
               {renderContentSpecificFields()}
               <div className={styles.formGroup}>
                  <label htmlFor='completionDays'>Completion Time</label>
                  <input
                     type='number'
                     id='completionDays'
                     placeholder='Enter days'
                     value={completionDays}
                     onChange={(e) => setCompletionDays(e.target.value)}
                  />
                  <small>In Numbers (Time to complete in days)</small>
               </div>
               <div className={styles.formGroup}>
                  <label htmlFor='initialProgress'>Initial Progress</label>
                  <input
                     type='number'
                     id='initialProgress'
                     min='0'
                     max='100'
                     placeholder='Enter initial progress (%)'
                     value={initialProgress}
                     onChange={(e) => setInitialProgress(Number(e.target.value))}
                  />
               </div>
               <div className={styles.formGroup}>
                  <label>
                     <FontAwesomeIcon icon={faClock} /> Remind me
                  </label>
                  <div className={styles.checkboxGroup}>
                     <label>
                        <input
                           type='checkbox'
                           checked={reminders.resume}
                           onChange={(e) => setReminders({ ...reminders, resume: e.target.checked })}
                        />
                        {"Remind me if I don't resume within 3 days"}
                     </label>
                     <label>
                        <input
                           type='checkbox'
                           checked={reminders.deadline}
                           onChange={(e) => setReminders({ ...reminders, deadline: e.target.checked })}
                        />
                        Remind me 5 days before the deadline
                     </label>
                     <label>
                        <input
                           type='checkbox'
                           checked={reminders.every3Hours}
                           onChange={(e) => setReminders({ ...reminders, every3Hours: e.target.checked })}
                        />
                        Remind me Every 3 Hours
                     </label>
                  </div>
               </div>
               <div className={styles.formGroup}>
                  <label htmlFor='personalGoals'>Personal Goals</label>
                  <textarea
                     id='personalGoals'
                     placeholder='What do you hope to achieve by completing this task?'
                     value={personalGoals}
                     onChange={(e) => setPersonalGoals(e.target.value)}></textarea>
               </div>
               <div className={styles.formActions}>
                  <button type='button' className={styles.cancelButton} onClick={onClose}>
                     Cancel
                  </button>
                  <button type='submit' className={styles.startButton} disabled={isSubmitting}>
                     {isSubmitting ? (
                        <>
                           <span className={styles.loader}></span>
                           Submitting...
                        </>
                     ) : (
                        "Start"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

CreateLearningTask.propTypes = {
   onClose: PropTypes.func.isRequired,
   handleSubmit: PropTypes.func.isRequired,
};

export default CreateLearningTask;
