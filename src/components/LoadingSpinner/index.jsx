import styles from "./LoadingSpinner.module.css";

function LoadingSpinner() {
   return (
      <div className={styles.spinnerContainer}>
         <div className={styles.spinner}>
            <div className={styles.pulse}></div>
         </div>
         <p className={styles.loadingText}>Loading LearnHub...</p>
      </div>
   );
}

export default LoadingSpinner;
