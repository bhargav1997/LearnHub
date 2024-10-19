import { useState } from "react";
import { FaShare, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";
import styles from "./ShareJourney.module.css";
import PropTypes from "prop-types";

const ShareJourney = ({ journeyId, onClose }) => {
   const [email, setEmail] = useState("");

   const handleShare = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post(
            `${CONFIG.API_URL}/learning-journeys/${journeyId}/share`,
            { email },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );
         if (response.status === 200) {
            toast.success("Journey shared successfully");
            onClose();
         } else {
            toast.error(response?.data?.message || "Failed to share journey");
         }
      } catch (error) {
         toast.error("Failed to share journey: " + (error.response?.data?.message || error.message));
      }
   };

   return (
      <div className={styles.shareOverlay}>
         <div className={styles.shareModal}>
            <button className={styles.closeButton} onClick={onClose}>
               <FaTimes />
            </button>
            <h3>Share Journey</h3>
            <p className={styles.infoMessage}>
               Please enter the email of an existing LearnHub user. They will receive a notification to accept or reject the shared journey.
            </p>
            <form onSubmit={handleShare}>
               <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter email to share with'
                  required
               />
               <button type='submit' className={styles.shareButton}>
                  <FaShare /> Share
               </button>
            </form>
         </div>
      </div>
   );
};

ShareJourney.propTypes = {
   journeyId: PropTypes.string.isRequired,
   onClose: PropTypes.func.isRequired,
};

export default ShareJourney;
