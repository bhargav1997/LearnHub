import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faLock, faGlobe, faChartBar, faCog, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import styles from "./Setting.module.css";

function Setting() {
   const [settings, setSettings] = useState({
      emailNotifications: true,
      pushNotifications: false,
      inactivityReminders: true,
      deadlineReminders: true,
      makeProfilePublic: false,
      showProgressOnLeaderboards: true,
      allowTaskRecommendations: true,
      language: "en",
      timezone: "UTC",
      enableDarkMode: false,
      trackLearningTime: true,
      generateWeeklyReports: false,
      shareAnalyticsWithMentors: false,
      enableOfflineMode: false,
      useAIRecommendations: true,
   });

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSettings((prevSettings) => ({
         ...prevSettings,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSave = (e) => {
      e.preventDefault();
      // Here you would typically send the settings to your backend
      console.log("Settings saved:", settings);
      // You can also show a success message to the user
   };

   return (
      <div className={styles.settingsContainer}>
         <h1 className={styles.settingsTitle}>Settings</h1>

         <form onSubmit={handleSave}>
            <div className={styles.settingsGrid}>
               <section className={styles.settingSection}>
                  <h2>
                     <FontAwesomeIcon icon={faBell} /> Notification Settings
                  </h2>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='emailNotifications' checked={settings.emailNotifications} onChange={handleChange} />
                        Email notifications
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='pushNotifications' checked={settings.pushNotifications} onChange={handleChange} />
                        Push notifications
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='inactivityReminders' checked={settings.inactivityReminders} onChange={handleChange} />
                        Inactivity reminders
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='deadlineReminders' checked={settings.deadlineReminders} onChange={handleChange} />
                        Deadline reminders
                     </label>
                  </div>
               </section>

               <section className={styles.settingSection}>
                  <h2>
                     <FontAwesomeIcon icon={faLock} /> Privacy Settings
                  </h2>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='makeProfilePublic' checked={settings.makeProfilePublic} onChange={handleChange} />
                        Make profile public
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input
                           type='checkbox'
                           name='showProgressOnLeaderboards'
                           checked={settings.showProgressOnLeaderboards}
                           onChange={handleChange}
                        />
                        Show progress on leaderboards
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input
                           type='checkbox'
                           name='allowTaskRecommendations'
                           checked={settings.allowTaskRecommendations}
                           onChange={handleChange}
                        />
                        Allow task recommendations
                     </label>
                  </div>
               </section>

               <section className={styles.settingSection}>
                  <h2>
                     <FontAwesomeIcon icon={faGlobe} /> Preference Settings
                  </h2>
                  <div className={styles.formGroup}>
                     <label htmlFor='language'>Language</label>
                     <select id='language' name='language' value={settings.language} onChange={handleChange}>
                        <option value='en'>English</option>
                        <option value='es'>Spanish</option>
                        <option value='fr'>French</option>
                     </select>
                  </div>
                  <div className={styles.formGroup}>
                     <label htmlFor='timezone'>Timezone</label>
                     <select id='timezone' name='timezone' value={settings.timezone} onChange={handleChange}>
                        <option value='UTC'>UTC</option>
                        <option value='EST'>EST</option>
                        <option value='PST'>PST</option>
                     </select>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='enableDarkMode' checked={settings.enableDarkMode} onChange={handleChange} />
                        Enable dark mode
                     </label>
                  </div>
               </section>

               <section className={styles.settingSection}>
                  <h2>
                     <FontAwesomeIcon icon={faChartBar} /> Analytics Settings
                  </h2>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='trackLearningTime' checked={settings.trackLearningTime} onChange={handleChange} />
                        Track learning time
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input
                           type='checkbox'
                           name='generateWeeklyReports'
                           checked={settings.generateWeeklyReports}
                           onChange={handleChange}
                        />
                        Generate weekly reports
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input
                           type='checkbox'
                           name='shareAnalyticsWithMentors'
                           checked={settings.shareAnalyticsWithMentors}
                           onChange={handleChange}
                        />
                        Share analytics with mentors
                     </label>
                  </div>
               </section>

               <section className={styles.settingSection}>
                  <h2>
                     <FontAwesomeIcon icon={faCog} /> Advanced Settings
                  </h2>
                  <div className={styles.settingOption}>
                     <label>
                        <input type='checkbox' name='enableOfflineMode' checked={settings.enableOfflineMode} onChange={handleChange} />
                        Enable offline mode
                     </label>
                  </div>
                  <div className={styles.settingOption}>
                     <label>
                        <input
                           type='checkbox'
                           name='useAIRecommendations'
                           checked={settings.useAIRecommendations}
                           onChange={handleChange}
                        />
                        Use AI-powered recommendations
                     </label>
                  </div>
               </section>
            </div>

            <div className={styles.saveButtonContainer}>
               <button type='submit' className={styles.saveButton}>
                  Save All Settings
               </button>
            </div>
         </form>

         <section className={`${styles.settingSection} ${styles.dangerZone}`}>
            <h2>
               <FontAwesomeIcon icon={faExclamationTriangle} /> Danger Zone
            </h2>
            <p>Deleting your account is permanent and cannot be undone.</p>
            <button className={styles.dangerButton}>Delete Account</button>
         </section>
      </div>
   );
}

export default Setting;
