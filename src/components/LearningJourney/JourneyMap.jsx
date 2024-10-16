import React, { useState } from "react";
import { FaRoute, FaChevronRight, FaTimes } from "react-icons/fa";
import styles from "./JourneyMap.module.css";
import PropTypes from "prop-types";

const StepItem = ({ step, index, isCompleted }) => {
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
      <div className={`${styles.stepItem} ${isCompleted ? styles.completed : ""}`}>
         <div className={styles.stepNumber}>{index + 1}</div>
         <div className={styles.stepContent}>
            <h4>{step.split(":")[0]}</h4>
            <p>{renderStepContent(step)}</p>
         </div>
         {isCompleted && <div className={styles.completedIndicator} />}
      </div>
   );
};

const JourneyMap = ({ steps, completedSteps }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const displayedSteps = steps.slice(0, 3);
   const hasMoreSteps = steps.length > 3;

   return (
      <>
         <div className={styles.journeyMapContainer}>
            <h3 className={styles.journeyMapTitle}>
               <FaRoute /> Journey Progress
            </h3>
            <div className={styles.stepsContainer}>
               {displayedSteps.map((step, index) => (
                  <StepItem key={index} step={step} index={index} isCompleted={completedSteps.includes(index)} />
               ))}
            </div>
            {hasMoreSteps && (
               <button className={styles.viewMoreBtn} onClick={() => setIsModalOpen(true)}>
                  View Full Journey <FaChevronRight />
               </button>
            )}
         </div>

         {isModalOpen && (
            <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                  <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                     <FaTimes />
                  </button>
                  <h2>Full Journey Map</h2>
                  <div className={styles.modalContent}>
                     {steps.map((step, index) => (
                        <StepItem key={index} step={step} index={index} isCompleted={completedSteps.includes(index)} />
                     ))}
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

JourneyMap.propTypes = {
   steps: PropTypes.array.isRequired,
   completedSteps: PropTypes.array.isRequired,
};

StepItem.propTypes = {
   step: PropTypes.string.isRequired,
   index: PropTypes.number.isRequired,
   isCompleted: PropTypes.bool.isRequired,
};

export default JourneyMap;
