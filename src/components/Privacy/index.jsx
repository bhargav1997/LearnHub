import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserFriends, faChartLine, faBullhorn, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./Privacy.module.css";

function Privacy() {
   const [settings, setSettings] = useState({
      profileVisibility: "public",
      showProgressOnLeaderboards: true,
      allowTaskRecommendations: true,
      shareAnalyticsWithMentors: false,
      allowSocialSharing: true,
   });

   const handleToggle = (setting) => {
      setSettings((prevSettings) => ({
         ...prevSettings,
         [setting]: !prevSettings[setting],
      }));
   };

   const handleProfileVisibilityChange = (e) => {
      setSettings((prevSettings) => ({
         ...prevSettings,
         profileVisibility: e.target.value,
      }));
   };

   return (
      <div className={styles.privacyContainer}>
         <h1 className={styles.privacyTitle}>Privacy Settings</h1>

         <div className={styles.settingSection}>
            <h2>
               <FontAwesomeIcon icon={faEye} /> Profile Visibility
            </h2>
            <p>Control who can see your profile and learning progress.</p>
            <select value={settings.profileVisibility} onChange={handleProfileVisibilityChange} className={styles.selectInput}>
               <option value='public'>Public</option>
               <option value='friends'>Friends Only</option>
               <option value='private'>Private</option>
            </select>
         </div>

         <div className={styles.settingSection}>
            <h2>
               <FontAwesomeIcon icon={faUserFriends} /> Leaderboards
            </h2>
            <p>Choose whether to show your progress on public leaderboards.</p>
            <label className={styles.toggleSwitch} htmlFor='showProgressOnLeaderboards'>
               <input
                  type='checkbox'
                  id='showProgressOnLeaderboards'
                  checked={settings.showProgressOnLeaderboards}
                  onChange={() => handleToggle("showProgressOnLeaderboards")}
               />
               <span className={styles.slider}></span>
            </label>
            <span className={styles.toggleLabel}>
               {settings.showProgressOnLeaderboards ? "Visible on Leaderboards" : "Hidden from Leaderboards"}
            </span>
         </div>

         <div className={styles.settingSection}>
            <h2>
               <FontAwesomeIcon icon={faChartLine} /> Task Recommendations
            </h2>
            <p>Allow Learn Hub to suggest personalized learning tasks based on your activity.</p>
            <label className={styles.toggleSwitch} htmlFor='allowTaskRecommendations'>
               <input
                  type='checkbox'
                  id='allowTaskRecommendations'
                  checked={settings.allowTaskRecommendations}
                  onChange={() => handleToggle("allowTaskRecommendations")}
               />
               <span className={styles.slider}></span>
            </label>
            <span className={styles.toggleLabel}>
               {settings.allowTaskRecommendations ? "Task Recommendations Enabled" : "Task Recommendations Disabled"}
            </span>
         </div>

         <div className={styles.settingSection}>
            <h2>
               <FontAwesomeIcon icon={faEyeSlash} /> Mentor Analytics Sharing
            </h2>
            <p>Share your learning analytics with assigned mentors for better guidance.</p>
            <label className={styles.toggleSwitch} htmlFor='shareAnalyticsWithMentors'>
               <input
                  type='checkbox'
                  id='shareAnalyticsWithMentors'
                  checked={settings.shareAnalyticsWithMentors}
                  onChange={() => handleToggle("shareAnalyticsWithMentors")}
               />
               <span className={styles.slider}></span>
            </label>
            <span className={styles.toggleLabel}>
               {settings.shareAnalyticsWithMentors ? "Sharing Analytics with Mentors" : "Not Sharing Analytics with Mentors"}
            </span>
         </div>

         <div className={styles.settingSection}>
            <h2>
               <FontAwesomeIcon icon={faBullhorn} /> Social Sharing
            </h2>
            <p>Allow automatic sharing of your achievements on connected social platforms.</p>
            <label className={styles.toggleSwitch} htmlFor='allowSocialSharing'>
               <input
                  type='checkbox'
                  id='allowSocialSharing'
                  checked={settings.allowSocialSharing}
                  onChange={() => handleToggle("allowSocialSharing")}
               />
               <span className={styles.slider}></span>
            </label>
            <span className={styles.toggleLabel}>{settings.allowSocialSharing ? "Social Sharing Enabled" : "Social Sharing Disabled"}</span>
         </div>

         <div className={styles.privacyInfo}>
            <h2>
               <FontAwesomeIcon icon={faShieldAlt} /> Your Privacy is Important
            </h2>
            <p>
               Learn Hub is committed to protecting your personal information. We never sell your data to third parties and only use it to
               improve your learning experience. For more information, please read our <a href='/privacy-policy'>Privacy Policy</a>.
            </p>
         </div>
      </div>
   );
}

export default Privacy;
