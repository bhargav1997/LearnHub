import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBookOpen, faClock, faLink } from "@fortawesome/free-solid-svg-icons";
import styles from "./CourseRecommendations.module.css";

function CourseRecommendations() {
   // This would be fetched from an API based on user preferences and added content
   const recommendedContent = [
      {
         id: 1,
         title: "Advanced React Patterns",
         type: "Course",
         level: "Advanced",
         rating: 4.8,
         duration: "10 hours",
         link: "https://example.com/react-patterns",
         addedBy: "John Doe",
      },
      {
         id: 2,
         title: "Clean Code: A Handbook of Agile Software Craftsmanship",
         type: "Book",
         author: "Robert C. Martin",
         pages: 464,
         link: "https://example.com/clean-code-book",
         addedBy: "Jane Smith",
      },
      {
         id: 3,
         title: "GraphQL Fundamentals",
         type: "Video",
         duration: "45 minutes",
         link: "https://example.com/graphql-video",
         addedBy: "Alice Johnson",
      },
   ];

   const renderContentDetails = (content) => {
      switch (content.type) {
         case "Course":
            return (
               <>
                  <p className={styles.contentLevel}>
                     <FontAwesomeIcon icon={faBookOpen} className={styles.icon} />
                     {content.level}
                  </p>
                  <p className={styles.contentRating}>
                     <FontAwesomeIcon icon={faStar} className={styles.icon} />
                     {content.rating.toFixed(1)}
                  </p>
                  <p className={styles.contentDuration}>
                     <FontAwesomeIcon icon={faClock} className={styles.icon} />
                     {content.duration}
                  </p>
               </>
            );
         case "Book":
            return (
               <>
                  <p className={styles.contentAuthor}>by {content.author}</p>
                  <p className={styles.contentPages}>
                     <FontAwesomeIcon icon={faBookOpen} className={styles.icon} />
                     {content.pages} pages
                  </p>
               </>
            );
         case "Video":
            return (
               <p className={styles.contentDuration}>
                  <FontAwesomeIcon icon={faClock} className={styles.icon} />
                  {content.duration}
               </p>
            );
         default:
            return null;
      }
   };

   return (
      <div className={styles.recommendationsContainer}>
         <h2 className={styles.recommendationsTitle}>Recommended Content</h2>
         <ul className={styles.contentList}>
            {recommendedContent.map((content) => (
               <li key={content.id} className={styles.contentItem}>
                  <div className={styles.contentInfo}>
                     <h3>{content.title}</h3>
                     <p className={styles.contentType}>{content.type}</p>
                     {renderContentDetails(content)}
                     <p className={styles.addedBy}>Added by: {content.addedBy}</p>
                  </div>
                  <div className={styles.contentActions}>
                     <a href={content.link} target='_blank' rel='noopener noreferrer' className={styles.linkButton}>
                        <FontAwesomeIcon icon={faLink} /> View
                     </a>
                     <button className={styles.addButton}>Add to My List</button>
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default CourseRecommendations;
