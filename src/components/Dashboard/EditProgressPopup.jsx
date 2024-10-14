import { faChevronDown, faClock, faCode, faLink, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState } from "react";
import "../../styles/Dashboard.css";
import { toast } from "react-toastify";
import axios from "axios";
import { CONFIG } from "../../config";

const EditProgressPopup = ({ task, onUpdateProgress, onClose }) => {
   const [notes, setNotes] = useState("");
   const [codeSnippet, setCodeSnippet] = useState("");
   const [resourceLinks, setResourceLinks] = useState([""]);
   const [timeSpent, setTimeSpent] = useState(0);
   const [taskSpecificProgress, setTaskSpecificProgress] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const API_URL = CONFIG.API_URL;
   const getTaskSpecificLabel = () => {
      let taskType = task.type || "";
      switch (taskType.toLowerCase()) {
         case "book":
            return "Pages read";
         case "video":
            return "Minutes watched";
         case "course":
            return "Lessons completed";
         default:
            return "Units completed";
      }
   };

   const handleError = (error, customMessage) => {
      console.error(customMessage, error);
      toast.error(customMessage || "An unexpected error occurred. Please try again.");
   };

   const addResourceLink = () => {
      setResourceLinks([...resourceLinks, ""]);
   };

   const removeResourceLink = (index) => {
      const newLinks = resourceLinks.filter((_, i) => i !== index);
      setResourceLinks(newLinks);
   };

   const updateResourceLink = (index, value) => {
      const newLinks = [...resourceLinks];
      newLinks[index] = value;
      setResourceLinks(newLinks);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const progressData = {
         taskSpecificProgress,
         notes,
         codeSnippet,
         resourceLinks: resourceLinks.filter((link) => link.trim() !== ""),
         timeSpent,
      };

      try {
         const token = localStorage.getItem("token");
         const response = await axios.put(`${API_URL}/tasks/learning-tasks/${task.id}/progress`, progressData, {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.statusText !== "OK") {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const updatedTask = await response.data;
         onUpdateProgress(updatedTask);
         toast.success("Progress updated successfully!");
         onClose();
      } catch (error) {
         console.error("Error updating progress:", error);
         handleError(error, "Failed to update progress");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className='edit-progress-overlay'>
         <div className='edit-progress-popup'>
            <h2>Update Progress for {task.name}</h2>
            <button className='close-button' onClick={onClose}>
               <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <form onSubmit={handleSubmit}>
               <div className='form-group'>
                  <label htmlFor='taskSpecificProgress'>{getTaskSpecificLabel()}</label>
                  <input
                     type='number'
                     id='taskSpecificProgress'
                     min='0'
                     value={taskSpecificProgress}
                     onChange={(e) => setTaskSpecificProgress(Number(e.target.value))}
                     required
                  />
               </div>
               <div className='form-group'>
                  <label htmlFor='timeSpent'>
                     <FontAwesomeIcon icon={faClock} /> Time Spent (minutes)
                  </label>
                  <input
                     type='number'
                     id='timeSpent'
                     min='0'
                     value={timeSpent}
                     onChange={(e) => setTimeSpent(Number(e.target.value))}
                     required
                  />
               </div>
               <div className='form-group'>
                  <label htmlFor='notes'>Notes</label>
                  <textarea
                     id='notes'
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     placeholder='What did you accomplish?'
                     required></textarea>
               </div>
               <div className='form-group'>
                  <label htmlFor='codeSnippet'>
                     <FontAwesomeIcon icon={faCode} /> Code Snippet
                  </label>
                  <textarea
                     id='codeSnippet'
                     value={codeSnippet}
                     onChange={(e) => setCodeSnippet(e.target.value)}
                     placeholder='Share a code snippet you worked on'></textarea>
               </div>
               <div className='form-group'>
                  <label>
                     <FontAwesomeIcon icon={faLink} /> Resource Links
                  </label>
                  {resourceLinks.map((link, index) => (
                     <div key={index} className='resource-link-input'>
                        <input
                           type='url'
                           value={link}
                           onChange={(e) => updateResourceLink(index, e.target.value)}
                           placeholder='Share a helpful resource'
                        />
                        {index > 0 && (
                           <button type='button' className='remove-link-button' onClick={() => removeResourceLink(index)}>
                              <FontAwesomeIcon icon={faTimes} />
                           </button>
                        )}
                     </div>
                  ))}
                  <button type='button' className='add-link-button' onClick={addResourceLink}>
                     <FontAwesomeIcon icon={faPlus} /> Add Resource Link
                  </button>
               </div>
               <div className='form-actions'>
                  <button type='button' className='cancel-button' onClick={onClose}>
                     Cancel
                  </button>
                  <button type='submit' className='update-button' disabled={isSubmitting}>
                     {isSubmitting ? "Updating..." : "Update Progress"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

EditProgressPopup.propTypes = {
   task: PropTypes.object.isRequired,
   onUpdateProgress: PropTypes.func.isRequired,
   onClose: PropTypes.func.isRequired,
};

export default EditProgressPopup;
