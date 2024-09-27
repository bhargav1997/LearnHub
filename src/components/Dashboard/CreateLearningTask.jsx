import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./CreateLearningTask.module.css";
import PropTypes from "prop-types";

function CreateLearningTask({ onClose }) {
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

   useEffect(() => {
      // Reset fields when task type changes
      setEstimatedTime("");
      setPages("");
      setChapters("");
   }, [taskType]);

   const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here
      console.log({
         taskType,
         taskTitle,
         sourceLink,
         estimatedTime,
         completionDays,
         pages,
         chapters,
         reminders,
         personalGoals,
      });
      onClose();
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
                     />
                  </div>
               </>
            );
         case "Video":
            return (
               <div className={styles.formGroup}>
                  <label htmlFor='estimatedTime'>Video Duration</label>
                  <input
                     type='text'
                     id='estimatedTime'
                     placeholder='e.g. 2 hours 30 minutes'
                     value={estimatedTime}
                     onChange={(e) => setEstimatedTime(e.target.value)}
                  />
               </div>
            );
         case "Article":
            return (
               <div className={styles.formGroup}>
                  <label htmlFor='estimatedTime'>Estimated Reading Time</label>
                  <input
                     type='text'
                     id='estimatedTime'
                     placeholder='e.g. 15 minutes'
                     value={estimatedTime}
                     onChange={(e) => setEstimatedTime(e.target.value)}
                  />
               </div>
            );
         default: // Course
            return (
               <div className={styles.formGroup}>
                  <label htmlFor='estimatedTime'>Estimated Course Duration</label>
                  <input
                     type='text'
                     id='estimatedTime'
                     placeholder='e.g. 10 hours'
                     value={estimatedTime}
                     onChange={(e) => setEstimatedTime(e.target.value)}
                  />
               </div>
            );
      }
   };

   return (
      <div className={styles.overlay}>
         <div className={styles.popup}>
            <h2>Create New Learning Task</h2>
            <button className={styles.closeButton} onClick={onClose}>
               <FontAwesomeIcon icon={faTimes} />
            </button>
            <form onSubmit={handleSubmit}>
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
                  <button type='submit' className={styles.startButton}>
                     Start
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

CreateLearningTask.propTypes = {
   onClose: PropTypes.func.isRequired,
};

export default CreateLearningTask;
