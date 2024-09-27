import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./LearningGoals.module.css";

function LearningGoals() {
   const [newGoal, setNewGoal] = useState("");
   const [goals, setGoals] = useState([
      { id: 1, text: "Complete React course", completed: false },
      { id: 2, text: "Build a full-stack project", completed: false },
   ]);

   const handleAddGoal = () => {
      if (newGoal.trim()) {
         setGoals([...goals, { id: Date.now(), text: newGoal, completed: false }]);
         setNewGoal("");
      }
   };

   const toggleGoalCompletion = (id) => {
      setGoals(goals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)));
   };

   const deleteGoal = (id) => {
      setGoals(goals.filter((goal) => goal.id !== id));
   };

   return (
      <div className={styles.goalsContainer}>
         <h2 className={styles.goalsTitle}>Your Learning Goals</h2>
         <div className={styles.addGoal}>
            <input
               type='text'
               value={newGoal}
               onChange={(e) => setNewGoal(e.target.value)}
               placeholder='Enter a new goal'
               className={styles.goalInput}
            />
            <button onClick={handleAddGoal} className={styles.addButton}>
               <FontAwesomeIcon icon={faPlus} /> Add Goal
            </button>
         </div>
         <ul className={styles.goalList}>
            {goals.map((goal) => (
               <li key={goal.id} className={styles.goalItem}>
                  <div className={styles.goalContent}>
                     <label className={styles.checkboxContainer}>
                        <input
                           type='checkbox'
                           checked={goal.completed}
                           onChange={() => toggleGoalCompletion(goal.id)}
                           className={styles.checkbox}
                        />
                        <span className={styles.checkmark}>
                           {goal.completed && <FontAwesomeIcon icon={faCheck} />}
                        </span>
                     </label>
                     <span className={`${styles.goalText} ${goal.completed ? styles.completed : ""}`}>{goal.text}</span>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className={styles.deleteButton}>
                     <FontAwesomeIcon icon={faTrash} />
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default LearningGoals;
