import styles from "./SidebarSkeleton.module.css";

const SidebarSkeleton = () => (
   <div className={styles.sidebarSkeleton}>
      <div className={styles.logoSkeleton}></div>
      <div className={styles.navSkeleton}>
         {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.navItemSkeleton}></div>
         ))}
      </div>
      <div className={styles.logoutSkeleton}></div>
   </div>
);

export default SidebarSkeleton;
