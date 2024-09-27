import styles from "./Home.module.css";

function PopularTags() {
   const tags = [
      { name: "javascript", posts: 82645 },
      { name: "bitcoin", posts: 62523, trending: true },
      { name: "design", posts: 51354, trending: true, location: "65,523 Posted" },
      { name: "innovation", posts: 48123 },
      { name: "tutorial", posts: 51354, trending: true, location: "65,523 Posted" },
      { name: "business", posts: 42645 },
   ];

   return (
      <div className={styles.popularTags}>
         <h2 className={styles.title}>Popular Tags</h2>
         <ul className={styles.tagList}>
            {tags.map((tag) => (
               <li key={tag.name} className={styles.tagItem}>
                  <span className={styles.tagName}>#{tag.name}</span>
                  <span className={styles.tagPosts}>{tag.posts} Posts</span>
                  {tag.trending && <span className={styles.trending}>Trending</span>}
                  {tag.location && <span className={styles.location}> {tag.location}</span>}
               </li>
            ))}
         </ul>
      </div>
   );
}

export default PopularTags;
