import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faBook, faVideo, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import styles from "./Calendar.module.css";
import PropTypes from "prop-types";

const CustomEvent = ({ event }) => {
   const getIcon = () => {
      switch (event.resourceType) {
         case "link":
            return faLink;
         case "video":
            return faVideo;
         case "book":
            return faBook;
         case "article":
            return faNewspaper;
         default:
            return faLink;
      }
   };

   return (
      <div className={styles.customEvent}>
         <FontAwesomeIcon icon={getIcon()} className={styles.eventIcon} />
         <span className={styles.eventTitle}>{event.title}</span>
      </div>
   );
};

CustomEvent.propTypes = {
   event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      resourceType: PropTypes.string.isRequired,
   }).isRequired,
};

export default CustomEvent;
