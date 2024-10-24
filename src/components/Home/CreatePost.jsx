import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes, faImage, faTags, faPen, faPaperPlane, faCode, faGraduationCap, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./CreatePost.module.css";
import { createPost } from '../../redux/posts/postsSlice';

function CreatePost() {
   const dispatch = useDispatch();
   const user = useSelector(state => state.user);

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [postTitle, setPostTitle] = useState("");
   const [postContent, setPostContent] = useState("");
   const [postTags, setPostTags] = useState([]);
   const [currentTag, setCurrentTag] = useState("");
   const [postImage, setPostImage] = useState(null);
   const [postCategory, setPostCategory] = useState("tech");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState(null);

   const handleCreatePost = () => {
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      resetForm();
   };

   const resetForm = () => {
      setPostTitle("");
      setPostContent("");
      setPostTags([]);
      setCurrentTag("");
      setPostImage(null);
      setPostCategory("tech");
      setError(null);
   };

   const handleAddTag = (e) => {
      e.preventDefault();
      if (currentTag && !postTags.includes(currentTag)) {
         setPostTags([...postTags, currentTag]);
         setCurrentTag("");
      }
   };

   const handleRemoveTag = (tagToRemove) => {
      setPostTags(postTags.filter((tag) => tag !== tagToRemove));
   };

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setPostImage(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmitPost = async () => {
      if (!postTitle || !postContent) {
         setError("Please fill in all required fields.");
         return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
         const postData = {
            title: postTitle,
            content: postContent,
            tags: postTags,
            image: postImage,
            category: postCategory,
            author: user.id,
         };

         await dispatch(createPost(postData)).unwrap();
         handleCloseModal();
      } catch (error) {
         setError('Failed to create post. Please try again.');
         console.log(error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <div className={styles.createPost}>
            <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
            <input type='text' placeholder="Share your tech insights or learning experiences..." readOnly onClick={handleCreatePost} className={styles.createPostInput} />
            <button className={styles.createPostBtn} onClick={handleCreatePost}>
               <FontAwesomeIcon icon={faPen} /> Create Post
            </button>
         </div>

         {isModalOpen && (
            <div className={styles.modalOverlay}>
               <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                     <h2>Create a New Post</h2>
                     <button className={styles.closeBtn} onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} />
                     </button>
                  </div>
                  <div className={styles.modalBody}>
                     <div className={styles.categorySelector}>
                        <button
                           className={`${styles.categoryBtn} ${postCategory === 'tech' ? styles.active : ''}`}
                           onClick={() => setPostCategory('tech')}
                        >
                           <FontAwesomeIcon icon={faCode} /> Tech
                        </button>
                        <button
                           className={`${styles.categoryBtn} ${postCategory === 'education' ? styles.active : ''}`}
                           onClick={() => setPostCategory('education')}
                        >
                           <FontAwesomeIcon icon={faGraduationCap} /> Education
                        </button>
                        <button
                           className={`${styles.categoryBtn} ${postCategory === 'innovation' ? styles.active : ''}`}
                           onClick={() => setPostCategory('innovation')}
                        >
                           <FontAwesomeIcon icon={faLightbulb} /> Innovation
                        </button>
                     </div>
                     <input
                        type='text'
                        placeholder='Enter an engaging title for your post'
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className={styles.postTitleInput}
                     />
                     <ReactQuill
                        value={postContent}
                        onChange={setPostContent}
                        placeholder="Share your knowledge, insights, or questions..."
                        className={styles.contentEditor}
                     />
                     <div className={styles.postTags}>
                        <FontAwesomeIcon icon={faTags} />
                        <input
                           type='text'
                           placeholder='Add relevant tags (e.g., JavaScript, MachineLearning)'
                           value={currentTag}
                           onChange={(e) => setCurrentTag(e.target.value)}
                           onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                        />
                        <button onClick={handleAddTag}>Add</button>
                     </div>
                     <div className={styles.tagsContainer}>
                        {postTags.map((tag, index) => (
                           <span key={index} className={styles.tag}>
                              {tag}
                              <button onClick={() => handleRemoveTag(tag)}>×</button>
                           </span>
                        ))}
                     </div>
                     <div className={styles.imageUpload}>
                        <label htmlFor='file-input'>
                           <FontAwesomeIcon icon={faImage} /> Add Image
                        </label>
                        <input id='file-input' type='file' accept='image/*' onChange={handleImageUpload} style={{ display: "none" }} />
                     </div>
                     {postImage && (
                        <div className={styles.imagePreview}>
                           <img src={postImage} alt='Post preview' />
                        </div>
                     )}
                     {error && <div className={styles.error}>{error}</div>}
                  </div>
                  <div className={styles.modalFooter}>
                     <button className={styles.cancelBtn} onClick={handleCloseModal}>
                        Cancel
                     </button>
                     <button className={styles.submitBtn} onClick={handleSubmitPost} disabled={isSubmitting}>
                        <FontAwesomeIcon icon={faPaperPlane} /> {isSubmitting ? 'Posting...' : 'Post'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default CreatePost;
