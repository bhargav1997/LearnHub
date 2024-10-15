import styles from "./MobileRestriction.module.css";

const MobileRestriction = () => {
   return (
      <div className={styles.mobileRestriction}>
         <h2>Experience the Full Potential</h2>
         <p>Our application is optimized for larger screens to provide you with the best learning experience.</p>
         <ul className={styles.benefitsList}>
            <li>Track progress across learning materials</li>
            <li>Set and achieve educational goals</li>
            <li>Connect with like-minded learners</li>
            <li>Access curated learning resources</li>
            <li>Get personalized recommendations</li>
         </ul>
         <p className={styles.callToAction}>
            Join us on a tablet, laptop, or desktop to unlock these features and accelerate your learning journey!
         </p>
         <p className={styles.mobileUpdate}>We&apos;re working on a mobile-friendly version. Thank you for your patience!</p>
      </div>
   );
};

export default MobileRestriction;
