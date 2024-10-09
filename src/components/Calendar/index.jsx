import { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCalendarPlus, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./Calendar.module.css";

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
   // const [currentDate, setCurrentDate] = useState(new Date());

   useEffect(() => {
      // Fetch events from your backend or local storage
      const dummyEvents = [
         {
            id: 1,
            title: "React Advanced Concepts",
            start: new Date(2023, 4, 10, 10, 0),
            end: new Date(2023, 4, 10, 11, 0),
         },
         {
            id: 2,
            title: "Machine Learning Basics",
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
      const updatedEvents = [...events, { ...newEvent, id: Date.now() }];
      setEvents(updatedEvents);
      await sendEmailNotification(newEvent);
      setShowModal(false);
      setNewEvent({
         title: "",
         start: new Date(),
         end: new Date(),
         description: "",
      });
   };

   const sendEmailNotification = async (event) => {
      console.log("Sending email notification for:", event);
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
               selectable
               className={styles.calendar}
               components={{
                  toolbar: CustomToolbar,
               }}
            />
         </div>
         {showModal && (
            <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                  <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <h2>
                     <FontAwesomeIcon icon={faCalendarPlus} /> Schedule Learning Session
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
                        <button type='submit' className={styles.submitButton}>
                           Schedule Session
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
