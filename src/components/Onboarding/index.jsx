import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBook, faTasks, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import styles from "./Onboarding.module.css";
import PropTypes from "prop-types";

const onboardingSteps = [
   {
      title: "Welcome to LearnHub",
      description: "Let's get you started on your learning journey!",
      icon: faGraduationCap,
   },
   {
      title: "Explore Courses",
      description: "Discover a wide range of courses tailored to your interests.",
      icon: faBook,
   },
   {
      title: "Track Your Progress",
      description: "Set goals and monitor your learning achievements.",
      icon: faTasks,
   },
   {
      title: "Join the Community",
      description: "Connect with fellow learners and participate in discussions.",
      icon: faUsers,
   },
   {
      title: "Customize Your Experience",
      description: "Adjust your settings to personalize your learning environment.",
      icon: faCog,
   },
];

function Onboarding({ onComplete }) {
   const [currentStep, setCurrentStep] = useState(0);

   const handleNext = () => {
      if (currentStep < onboardingSteps.length - 1) {
         setCurrentStep(currentStep + 1);
      } else {
         onComplete();
      }
   };

   const handleSkip = () => {
      onComplete();
   };

   const isLastStep = currentStep === onboardingSteps.length - 1;

   return (
      <div className={styles.onboardingOverlay}>
         <div className={styles.onboardingModal}>
            <div className={styles.stepIndicator}>
               {onboardingSteps.map((_, index) => (
                  <div key={index} className={`${styles.stepDot} ${index === currentStep ? styles.active : ""}`} />
               ))}
            </div>
            <div className={styles.stepContent}>
               <FontAwesomeIcon icon={onboardingSteps[currentStep].icon} className={styles.stepIcon} />
               <h2>{onboardingSteps[currentStep].title}</h2>
               <p>{onboardingSteps[currentStep].description}</p>
            </div>
            <div className={`${styles.navigationButtons} ${isLastStep ? styles.centerButton : ""}`}>
               {!isLastStep ? (
                  <>
                     <button onClick={handleSkip} className={styles.skipButton}>
                        Skip
                     </button>
                     <button onClick={handleNext} className={styles.nextButton}>
                        Next
                     </button>
                  </>
               ) : (
                  <button onClick={handleNext} className={styles.getStartedButton}>
                     Get Started
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}

Onboarding.propTypes = {
   onComplete: PropTypes.func.isRequired,
};

export default Onboarding;
