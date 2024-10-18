import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBookOpen, faClock, faLink, faBolt, faRobot, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./CourseRecommendations.module.css";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { CONFIG } from "../../config";

// Mock data for testing
// const mockRecommendations = [
//    {
//       id: 1,
//       title: "Advanced Machine Learning Techniques",
//       type: "Course",
//       level: "Advanced",
//       rating: "4.8",
//       duration: "40 hours",
//       link: "https://example.com/course-1",
//       addedBy: "AI Recommendation",
//       aiReason: "Based on your interest in data science and previous completion of basic machine learning courses",
//    },
//    {
//       id: 2,
//       title: "Full Stack Web Development with React and Node.js",
//       type: "Course",
//       level: "Intermediate",
//       rating: "4.6",
//       duration: "60 hours",
//       link: "https://example.com/course-2",
//       addedBy: "AI Recommendation",
//       aiReason: "Aligns with your goal to become a full-stack developer",
//    },
//    {
//       id: 3,
//       title: "Blockchain Fundamentals",
//       type: "Course",
//       level: "Beginner",
//       rating: "4.5",
//       duration: "25 hours",
//       link: "https://example.com/course-3",
//       addedBy: "AI Recommendation",
//       aiReason: "Trending technology that complements your software engineering skills",
//    },
// ];

// const MAX_RETRIES = 1;
// const RETRY_DELAY = 10000; // 10 seconds

function CourseRecommendations() {
   // const HF_API_TOKEN = CONFIG.API_TOKEN;

   const [recommendedContent, setRecommendedContent] = useState([]);
   const [userPreferences, setUserPreferences] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);
   const [showError, setShowError] = useState(false);
   const { user } = useSelector((state) => state.user);
   const [apiLoading, setApiLoading] = useState(true);

   useEffect(() => {
      try {
         const { skills } = user;
         setUserPreferences(skills);
      } catch (error) {
         console.error("Error fetching user preferences:", error);
         setUserPreferences(null); // Fallback to no preferences
      }
   }, [user]);

   useEffect(() => {
      if (userPreferences !== null) {
         // For testing, we'll use mock data instead of fetching
         fetchAIRecommendations();
         // setRecommendedContent(mockRecommendations);
         setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userPreferences]);

   useEffect(() => {
      if (error) {
         setShowError(true);
         const timer = setTimeout(() => {
            setShowError(false);
         }, 5000); // Hide error after 5 seconds

         return () => clearTimeout(timer);
      }
   }, [error]);

   const fetchAIRecommendations = async (retryCount = 0) => {
      setApiLoading(true);
      setError(null);
      // try {
      // const userSkills = userPreferences.join(", ");
      // const prompt = `Given a user with skills in ${userSkills}, suggest 3 advanced IT courses or topics to study next. For each suggestion, provide a brief explanation of why it's recommended. Format the response as a numbered list.`;

      // const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-xxl", {
      //    method: "POST",
      //    headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${HF_API_TOKEN}`,
      //       "x-use-cache": "false",
      //       "x-wait-for-model": "true",
      //    },
      //    body: JSON.stringify({ inputs: prompt }),
      // });

      // if (!response.ok) {
      //    const errorData = await response.json();
      //    if (errorData.error && errorData.error.includes("is currently loading")) {
      //       if (retryCount < MAX_RETRIES) {
      //          console.log(`Model is loading. Retrying in ${RETRY_DELAY / 1000} seconds...`);
      //          setTimeout(() => fetchAIRecommendations(retryCount + 1), RETRY_DELAY);
      //          return;
      //       } else {
      //          throw new Error("Model took too long to load. Using fallback data.");
      //       }
      //    }
      //    throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.json();
      // const recommendations = parseAIRecommendations(data[0].generated_text);
      // setRecommendedContent(recommendations);
      setApiLoading(false);
      // } catch (error) {
      // console.error("Error fetching AI recommendations:", error);
      // setError("We couldn't load AI recommendations at the moment. Here are some great courses for you!");
      setRecommendedContent(getFallbackRecommendations(userPreferences));
      setApiLoading(false);
      // } finally {
      //    setIsLoading(false);
      // }
   };

   // const parseAIRecommendations = (text) => {
   //    const recommendations = text
   //       .split(/\d+\./)
   //       .filter((item) => item.trim() !== "")
   //       .map((item) => item.trim());
   //    return recommendations.map((recommendation, index) => {
   //       const [title, ...reasonParts] = recommendation.split(":");
   //       const reason = reasonParts.join(":").trim();
   //       return {
   //          id: index + 1,
   //          title: title.trim(),
   //          type: "Course",
   //          level: "Advanced",
   //          rating: (4 + Math.random()).toFixed(1),
   //          duration: `${Math.floor(Math.random() * 40 + 20)} hours`,
   //          link: `https://example.com/course-${index + 1}`,
   //          addedBy: "AI Recommendation",
   //          aiReason: reason,
   //       };
   //    });
   // };

   const renderContentDetails = (content) => (
      <>
         <div className={styles.contentType}>
            <FontAwesomeIcon icon={faBookOpen} className={styles.icon} />
            {content.type} • {content.level}
         </div>
         <div className={styles.contentDetails}>
            <div className={styles.contentRating}>
               <FontAwesomeIcon icon={faStar} className={styles.icon} /> {content.rating}
            </div>
            <div className={styles.contentDuration}>
               <FontAwesomeIcon icon={faClock} className={styles.icon} /> {content.duration}
            </div>
            <div className={styles.contentLink}>
               <FontAwesomeIcon icon={faLink} className={styles.icon} />
               <a href={content.link} target='_blank' rel='noopener noreferrer'>
                  View Course
               </a>
            </div>
            <div className={styles.contentAddedBy}>
               <FontAwesomeIcon icon={faBolt} className={styles.icon} /> {content.addedBy}
            </div>
         </div>
         <div className={styles.aiReason}>
            <FontAwesomeIcon icon={faRobot} className={styles.icon} /> {content.aiReason}
         </div>
      </>
   );

   const getFallbackRecommendations = () => {
      // Implement logic to generate recommendations based on skills
      // This is a simple example; you should expand this based on your needs
      return [
         {
            id: 1,
            title: "Advanced React and Redux Patterns",
            type: "Course",
            level: "Advanced",
            rating: "4.8",
            duration: "40 hours",
            link: "https://example.com/course-1",
            addedBy: "AI Recommendation",
            aiReason:
               "Given your experience with JavaScript and the MERN stack, this course will deepen your understanding of React and Redux, introducing advanced patterns and best practices.",
         },
         {
            id: 2,
            title: "Microservices Architecture with Node.js",
            type: "Course",
            level: "Advanced",
            rating: "4.7",
            duration: "35 hours",
            link: "https://example.com/course-2",
            addedBy: "AI Recommendation",
            aiReason:
               "Building on your Node.js skills, this course will teach you how to design and implement scalable microservices architectures, a valuable skill in modern web development.",
         },
         {
            id: 3,
            title: "GraphQL API Development",
            type: "Course",
            level: "Advanced",
            rating: "4.6",
            duration: "30 hours",
            link: "https://example.com/course-3",
            addedBy: "AI Recommendation",
            aiReason:
               "As a MERN stack developer, learning GraphQL will enhance your API development skills, allowing you to build more efficient and flexible backends for your applications.",
         },
      ];
   };

   const renderSkeletonLoader = () => (
      <ul className={styles.contentList}>
         {[1, 2, 3].map((item) => (
            <li key={item} className={styles.contentItem}>
               <Skeleton height={30} width='80%' style={{ marginBottom: "16px" }} />
               <Skeleton height={20} width='40%' style={{ marginBottom: "16px" }} />
               <div className={styles.contentDetails}>
                  <Skeleton height={20} width='30%' />
                  <Skeleton height={20} width='30%' />
                  <Skeleton height={20} width='30%' />
               </div>
               <Skeleton height={60} style={{ marginTop: "20px" }} />
            </li>
         ))}
      </ul>
   );

   return (
      <div className={styles.recommendationsContainer}>
         <h2 className={styles.recommendationsTitle}>
            <FontAwesomeIcon icon={faHandHoldingHeart} className={styles.aiIcon} />
            Recommendations
         </h2>
         {showError && <p className={styles.errorText}>{error}</p>}
         {isLoading ? (
            <p className={styles.loadingText}>Analyzing trends and generating recommendations...</p>
         ) : apiLoading ? (
            renderSkeletonLoader()
         ) : (
            <ul className={styles.contentList}>
               {recommendedContent.map((content) => (
                  <li key={content.id} className={styles.contentItem}>
                     <h3 className={styles.contentTitle}>{content.title}</h3>
                     {renderContentDetails(content)}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

export default CourseRecommendations;
