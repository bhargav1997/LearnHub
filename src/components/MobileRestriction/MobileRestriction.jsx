import styles from "./MobileRestriction.module.css";

const MobileRestriction = () => {
   return (
      <div className={styles.mobileRestriction}>
         <h2>Experience the Full Potential</h2>
         <p>
            Our application is optimized for larger screens to provide you with the best learning experience.
         </p>
         <ul className={styles.benefitsList}>
            <li>Immersive interactive lessons</li>
            <li>Comprehensive coding exercises</li>
            <li>Real-time collaboration features</li>
            <li>Advanced code visualization tools</li>
         </ul>
         <p className={styles.callToAction}>
            Join us on a tablet, laptop, or desktop to unlock these features and accelerate your learning journey!
         </p>
         <p className={styles.mobileUpdate}>We&apos;re working on a mobile-friendly version. Thank you for your patience!</p>
      </div>
   );
};

export default MobileRestriction;
