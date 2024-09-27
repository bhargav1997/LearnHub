import { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./Calendar.module.css";

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

function Calendar() {
   const [events, setEvents] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [newEvent, setNewEvent] = useState({
      title: "",
      start: new Date(),
      end: new Date(),
      description: "",
   });

   useEffect(() => {
      // Fetch events from your backend or local storage
      // For now, we'll use dummy data
      const dummyEvents = [
         {
            id: 1,
            title: "Meeting with team",
            start: new Date(2023, 4, 10, 10, 0),
            end: new Date(2023, 4, 10, 11, 0),
         },
         {
            id: 2,
            title: "Lunch with client",
            start: new Date(2023, 4, 12, 12, 0),
            end: new Date(2023, 4, 12, 13, 0),
         },
      ];
      setEvents(dummyEvents);
   }, []);

   const handleSelectSlot = (slotInfo) => {
      setNewEvent({
         ...newEvent,
         start: slotInfo.start,
         end: slotInfo.end,
      });
      setShowModal(true);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewEvent({ ...newEvent, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      // Add the new event to the events array
      const updatedEvents = [...events, { ...newEvent, id: Date.now() }];
      setEvents(updatedEvents);

      // Send email notification
      await sendEmailNotification(newEvent);

      // Close the modal and reset the form
      setShowModal(false);
      setNewEvent({
         title: "",
         start: new Date(),
         end: new Date(),
         description: "",
      });
   };

   const sendEmailNotification = async (event) => {
      // This is a placeholder function. In a real application, you would
      // make an API call to your backend, which would then send the email.
      console.log("Sending email notification for:", event);
      // The backend would handle creating the .ics file and sending the email
   };

   return (
      <div className={styles.calendarContainer}>
         <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 600 }}
            onSelectSlot={handleSelectSlot}
            selectable
            className={styles.calendar}
         />
         {showModal && (
            <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                  <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <h2>
                     <FontAwesomeIcon icon={faCalendarPlus} /> Add New Learning
                  </h2>
                  <form onSubmit={handleSubmit}>
                     <div className={styles.formGroup}>
                        <label htmlFor='title'>New Learning Title</label>
                        <input
                           type='text'
                           id='title'
                           name='title'
                           value={newEvent.title}
                           onChange={handleInputChange}
                           required
                           placeholder='Enter learning title'
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='description'>Learning Description</label>
                        <textarea
                           id='description'
                           name='description'
                           value={newEvent.description}
                           onChange={handleInputChange}
                           placeholder='Enter learning description'
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
                           placeholder='Select start time'
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
                           placeholder='Select end time'
                        />
                     </div>
                     <div className={styles.formActions}>
                        <button type='submit' className={styles.submitButton}>
                           Start Learning
                        </button>
                        <button type='button' onClick={() => setShowModal(false)} className={styles.cancelButton}>
                           Cancel
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}

export default Calendar;
