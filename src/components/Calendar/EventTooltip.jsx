import moment from "moment";
import PropTypes from "prop-types";
import styles from "./Calendar.module.css";
const EventTooltip = ({ event }) => (
   <div className={styles.eventTooltip}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Start: {moment(event.start).format("MMMM D, YYYY h:mm A")}</p>
      <p>End: {moment(event.end).format("MMMM D, YYYY h:mm A")}</p>
      <p>Resource: {event.resourceType}</p>
      <a href={event.resourceLink} target='_blank' rel='noopener noreferrer'>
         Open Resource
      </a>
   </div>
);

EventTooltip.propTypes = {
   event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired,
      resourceType: PropTypes.string.isRequired,
      resourceLink: PropTypes.string.isRequired,
   }).isRequired,
};

export default EventTooltip;
