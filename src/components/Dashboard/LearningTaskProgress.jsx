import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import styles from "./LearningTaskProgress.module.css";

function LearningTaskProgress({ task, onUpdateProgress }) {
   const [progress, setProgress] = useState(task.progress);

   const handleProgressChange = (e) => {
      const newProgress = Number(e.target.value);
      setProgress(newProgress);
      onUpdateProgress(task.id, newProgress);
   };

   return (
      <div className={styles.taskProgress}>
         <h3>{task.taskTitle}</h3>
         <p>{task.taskType}</p>
         <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
         </div>
         <input type='range' min='0' max='100' value={progress} onChange={handleProgressChange} />
         <p>{progress}% Complete</p>
         <div className={styles.taskDetails}>
            <span>
               <FontAwesomeIcon icon={faClock} /> {task.estimatedTime}
            </span>
            {progress === 100 && (
               <span className={styles.completed}>
                  <FontAwesomeIcon icon={faCheck} /> Completed
               </span>
            )}
         </div>
      </div>
   );
}

LearningTaskProgress.propTypes = {
   task: PropTypes.object.isRequired,
   onUpdateProgress: PropTypes.func.isRequired,
};

export default LearningTaskProgress;
