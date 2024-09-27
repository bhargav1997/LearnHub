import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes, faImage, faTags, faPen } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./CreatePost.module.css";

function CreatePost() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [postTitle, setPostTitle] = useState("");
   const [postContent, setPostContent] = useState("");
   const [postTags, setPostTags] = useState([]);
   const [currentTag, setCurrentTag] = useState("");
   const [postImage, setPostImage] = useState(null);

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

   const handleSubmitPost = () => {
      const postData = {
         title: postTitle,
         content: postContent,
         tags: postTags,
         image: postImage,
      };
      console.log("Submitting post:", JSON.stringify(postData, null, 2));
      handleCloseModal();
   };

   return (
      <>
         <div className={styles.createPost}>
            <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
            <input type='text' placeholder="What's on your mind?" readOnly onClick={handleCreatePost} className={styles.createPostInput} />
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
                     <input
                        type='text'
                        placeholder='Enter post title'
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className={styles.postTitleInput}
                     />
                     <ReactQuill value={postContent} onChange={setPostContent} placeholder="What's on your mind?" />
                     <div className={styles.postTags}>
                        <FontAwesomeIcon icon={faTags} />
                        <input
                           type='text'
                           placeholder='Add tags'
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
                  </div>
                  <div className={styles.modalFooter}>
                     <button className={styles.cancelBtn} onClick={handleCloseModal}>
                        Cancel
                     </button>
                     <button className={styles.submitBtn} onClick={handleSubmitPost}>
                        Post
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default CreatePost;
