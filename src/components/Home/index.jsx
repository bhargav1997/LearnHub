import CreatePost from "./CreatePost";

import Profile from "./Profile";
import PopularTags from "./PopularTags";
import styles from "./Home.module.css";
import PostList from "./PostList";
import "../../styles/Home.css";
import Progress from "./Progress";
import CourseRecommendations from "./CourseRecommendations";
import LearningGoals from "./LearningGoals";

function Home() {
   return (
      <div className={styles.container}>
         <div className={styles.mainContent}>
            <CreatePost />
            <PostList />
            <Progress />
            <CourseRecommendations />
         </div>
         <aside className={styles.sidebar}>
            <Profile />
            <LearningGoals />
            <PopularTags />
         </aside>
      </div>
   );
}

export default Home;
