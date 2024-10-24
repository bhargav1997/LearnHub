import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../redux/posts/postsSlice";
import Post from "./Post";
import styles from "./PostList.module.css";

function PostList() {
   const dispatch = useDispatch();
   const { items: posts, status, error, page, hasMore } = useSelector((state) => state.posts);

   console.log("posts", posts);

   useEffect(() => {
      if (status === "idle") {
         dispatch(fetchPosts({ page: 1, limit: 10 }));
      }
   }, [status, dispatch]);

   const handleLoadMore = () => {
      if (hasMore) {
         dispatch(fetchPosts({ page, limit: 10 }));
      }
   };

   // const renderError = () => {
   //    if (typeof error === "string") {
   //       return <div className={styles.error}>{error}</div>;
   //    } else if (error && typeof error === "object") {
   //       return <div className={styles.error}>{error.message || "An error occurred"}</div>;
   //    }
   //    return null;
   // };

   return (
      <div className={styles.postList}>
         {posts.length === 0 && status !== "loading" ? (
            <div className={styles.noPosts}>No posts found</div>
         ) : (
            posts.map((post) => <Post key={post._id} post={post} />)
         )}
         {status === "loading" && <div className={styles.loading}>Loading...</div>}
         {/* {renderError()} */}
         {status !== "loading" && !error && hasMore && (
            <button className={styles.loadMore} onClick={handleLoadMore}>
               Load More
            </button>
         )}
      </div>
   );
}

export default PostList;
