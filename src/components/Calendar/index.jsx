import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios"; // Make sure to install axios
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faTimes,
   faCalendarPlus,
   faChevronLeft,
   faChevronRight,
   faLink,
   faBook,
   faVideo,
   faNewspaper,
   faEdit,
   faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Calendar.module.css";
import { addEvent, setEvents, updateEvent, deleteEvent } from "../../redux/calendar/calendarSlice";
import CustomEvent from "./CustomEvent";
import EventTooltip from "./EventTooltip";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);
import { CONFIG } from "../../config";

const API_URL = CONFIG.API_URL;

function Calendar() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const events = useSelector((state) => state.calendar.events);
   const [showModal, setShowModal] = useState(false);
   const [editingEvent, setEditingEvent] = useState(null);
   const [newEvent, setNewEvent] = useState({
      title: "",
      start: new Date(),
      end: new Date(),
      description: "",
      resourceType: "link",
      resourceLink: "",
   });
   const [tooltipEvent, setTooltipEvent] = useState(null);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      fetchEvents();
   }, []);

   const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      return {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      };
   };

   const handleUnauthorized = () => {
      localStorage.removeItem("token");
      toast.error("Your session has expired. Please log in again.");
      navigate("/login");
   };

   const fetchEvents = async () => {
      try {
         const response = await axios.get(`${API_URL}/events`, getAuthHeaders());
         dispatch(setEvents(response.data));
      } catch (error) {
         console.error("Error fetching events:", error);
         if (error.response && error.response.status === 401) {
            handleUnauthorized();
         } else {
            toast.error("Failed to fetch events. Please try again later.");
         }
      }
   };

   const handleSelectSlot = (slotInfo) => {
      setNewEvent({
         ...newEvent,
         start: slotInfo.start,
         end: slotInfo.end,
      });
      setEditingEvent(null);
      setShowModal(true);
   };

   const handleSelectEvent = (event) => {
      setEditingEvent(event);
      setNewEvent(event);
      setShowModal(true);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewEvent({ ...newEvent, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Close the modal after 1 second
      setTimeout(() => {
         setShowModal(false);
         resetForm();
      }, 1000);

      // Perform the API request in the background
      try {
         if (editingEvent) {
            const response = await axios.put(`${API_URL}/events/${editingEvent._id}`, newEvent, getAuthHeaders());
            dispatch(updateEvent(response.data));
            toast.success("Event updated successfully!");
         } else {
            const response = await axios.post(`${API_URL}/events`, newEvent, getAuthHeaders());
            dispatch(addEvent(response.data));
            toast.success("Event created successfully!");
         }
         fetchEvents();
      } catch (error) {
         console.error("Error saving event:", error);
         if (error.response) {
            if (error.response.status === 401) {
               handleUnauthorized();
            } else {
               toast.error(`Error: ${error.response.data.message || "Failed to save event"}`);
            }
         } else if (error.request) {
            toast.error("No response received from server. Please try again.");
         } else {
            toast.error("An unexpected error occurred. Please try again.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteClick = () => {
      setShowConfirmModal(true);
   };

   const handleConfirmDelete = async () => {
      setShowConfirmModal(false);
      if (editingEvent) {
         try {
            await axios.delete(`${API_URL}/events/${editingEvent._id}`, getAuthHeaders());
            dispatch(deleteEvent(editingEvent._id));
            setShowModal(false);
            resetForm();
            toast.success("Event deleted successfully!");
            fetchEvents();
         } catch (error) {
            console.error("Error deleting event:", error);
            if (error.response) {
               if (error.response.status === 401) {
                  handleUnauthorized();
               } else {
                  toast.error(`Error: ${error.response.data.message || "Failed to delete event"}`);
               }
            } else if (error.request) {
               toast.error("No response received from server. Please try again.");
            } else {
               toast.error("An unexpected error occurred. Please try again.");
            }
         }
      }
   };

   const handleCancelDelete = () => {
      setShowConfirmModal(false);
   };

   const resetForm = () => {
      setNewEvent({
         title: "",
         start: new Date(),
         end: new Date(),
         description: "",
         resourceType: "link",
         resourceLink: "",
      });
      setEditingEvent(null);
   };

   const CustomToolbar = (toolbar) => {
      const goToBack = () => {
         toolbar.date.setMonth(toolbar.date.getMonth() - 1);
         toolbar.onNavigate("prev");
      };

      const goToNext = () => {
         toolbar.date.setMonth(toolbar.date.getMonth() + 1);
         toolbar.onNavigate("next");
      };

      const goToCurrent = () => {
         const now = new Date();
         toolbar.date.setMonth(now.getMonth());
         toolbar.date.setYear(now.getFullYear());
         toolbar.onNavigate("current");
      };

      const label = () => {
         const date = moment(toolbar.date);
         return <span className={styles.calendarTitle}>{date.format("MMMM YYYY")}</span>;
      };

      return (
         <div className={styles.customToolbar}>
            <button className={styles.toolbarButton} onClick={goToBack}>
               <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className={styles.toolbarButton} onClick={goToCurrent}>
               Today
            </button>
            <button className={styles.toolbarButton} onClick={goToNext}>
               <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <span className={styles.toolbarLabel}>{label()}</span>
         </div>
      );
   };

   return (
      <div className={styles.calendarContainer}>
         <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} />

         <div className={styles.calendarHeader}>
            <h2>Learning Schedule</h2>
            <button className={styles.addEventButton} onClick={() => setShowModal(true)}>
               <FontAwesomeIcon icon={faCalendarPlus} /> Add Learning Session
            </button>
         </div>
         <div className={styles.calendarContent}>
            <BigCalendar
               localizer={localizer}
               events={events}
               startAccessor='start'
               endAccessor='end'
               onSelectSlot={handleSelectSlot}
               onSelectEvent={handleSelectEvent}
               selectable
               className={styles.calendar}
               components={{
                  toolbar: CustomToolbar,
                  event: CustomEvent,
               }}
               onMouseEnter={(event) => setTooltipEvent(event)}
               onMouseLeave={() => setTooltipEvent(null)}
            />
            {tooltipEvent && <EventTooltip event={tooltipEvent} />}
         </div>
         {showModal && (
            <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                  <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <h2>
                     <FontAwesomeIcon icon={editingEvent ? faEdit : faCalendarPlus} />{" "}
                     {editingEvent ? "Edit Learning Session" : "Schedule Learning Session"}
                  </h2>
                  <form onSubmit={handleSubmit}>
                     <div className={styles.formGroup}>
                        <label htmlFor='title'>Session Title</label>
                        <input
                           type='text'
                           id='title'
                           name='title'
                           value={newEvent.title}
                           onChange={handleInputChange}
                           required
                           placeholder='Enter session title'
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='description'>Session Description</label>
                        <textarea
                           id='description'
                           name='description'
                           value={newEvent.description}
                           onChange={handleInputChange}
                           placeholder='Enter session description'
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='resourceType'>Resource Type</label>
                        <select id='resourceType' name='resourceType' value={newEvent.resourceType} onChange={handleInputChange} required>
                           <option value='link'>Link</option>
                           <option value='video'>Video</option>
                           <option value='book'>Book</option>
                           <option value='article'>Article</option>
                        </select>
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='resourceLink'>
                           {newEvent.resourceType === "link" && <FontAwesomeIcon icon={faLink} />}
                           {newEvent.resourceType === "video" && <FontAwesomeIcon icon={faVideo} />}
                           {newEvent.resourceType === "book" && <FontAwesomeIcon icon={faBook} />}
                           {newEvent.resourceType === "article" && <FontAwesomeIcon icon={faNewspaper} />}
                           {" Resource Link"}
                        </label>
                        <input
                           type='text'
                           id='resourceLink'
                           name='resourceLink'
                           value={newEvent.resourceLink}
                           onChange={handleInputChange}
                           required
                           placeholder={`Enter ${newEvent.resourceType} link or details`}
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='start'>Start Time</label>
                        <input
                           type='datetime-local'
                           id='start'
                           name='start'
                           value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                           onChange={handleInputChange}
                           required
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='end'>End Time</label>
                        <input
                           type='datetime-local'
                           id='end'
                           name='end'
                           value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                           onChange={handleInputChange}
                           required
                        />
                     </div>
                     <div className={styles.formActions}>
                        <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
                           {isSubmitting
                              ? editingEvent
                                 ? "Updating..."
                                 : "Creating..."
                              : editingEvent
                              ? "Update Session"
                              : "Schedule Session"}
                        </button>
                        {editingEvent && (
                           <button type='button' onClick={handleDeleteClick} className={styles.deleteButton}>
                              <FontAwesomeIcon icon={faTrash} /> Delete
                           </button>
                        )}
                        <button type='button' onClick={() => setShowModal(false)} className={styles.cancelButton}>
                           Cancel
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
         {showConfirmModal && (
            <div className={styles.modalOverlay}>
               <div className={styles.confirmModal}>
                  <h3>Confirm Deletion</h3>
                  <p>Are you sure you want to delete this event?</p>
                  <div className={styles.confirmModalActions}>
                     <button onClick={handleConfirmDelete} className={styles.deleteButton}>
                        <FontAwesomeIcon icon={faTrash} /> Yes, delete
                     </button>
                     <button onClick={handleCancelDelete} className={styles.cancelButton}>
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Calendar;
