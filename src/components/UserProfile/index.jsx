import { useEffect, useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faUserPlus,
   faUserMinus,
   faSearch,
   faCode,
   faGraduationCap,
   faBriefcase,
   faMapMarkerAlt,
   faLink,
   faPen,
   faTimes,
   faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./UserProfile.module.css";
// import { setUser, fetchConnections } from "../../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice";
import { CONFIG } from "../../config";

function UserProfile() {
   const API_URL = CONFIG.API_URL;
   const [isEditing, setIsEditing] = useState(false);
   const [editedUser, setEditedUser] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [showConnectionsModal, setShowConnectionsModal] = useState(false);
   const [activeTab, setActiveTab] = useState("followers");
   const [suggestedConnections, setSuggestedConnections] = useState([]);
   const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
   const [suggestionsError, setSuggestionsError] = useState(null);

   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);

   useEffect(() => {
      if (user) {
         setEditedUser(user);
      }
   }, [user]);

   useEffect(() => {
      fetchSuggestedConnections();
   }, []);

   const fetchSuggestedConnections = async () => {
      setIsLoadingSuggestions(true);
      setSuggestionsError(null);
      try {
         const token = localStorage.getItem("token");
         if (!token) {
            throw new Error("No authentication token found");
         }

         const response = await axios.post(
            `${API_URL}/users/suggest-connections`,
            {
               user: { ...user },
               limit: 10,
               considerSkills: true,
               considerLearningGoals: false,
            },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            },
         );

         setSuggestedConnections(response.data);
      } catch (error) {
         console.error("Error fetching suggested connections:", error);
         setSuggestionsError("Failed to load suggested connections. Please try again later.");
      } finally {
         setIsLoadingSuggestions(false);
      }
   };

   const filteredConnections = suggestedConnections.filter(
      (connection) =>
         connection.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         connection.title.toLowerCase().includes(searchTerm.toLowerCase()),
   );

   // useEffect(() => {
   //    dispatch(fetchConnections()).catch((error) => {
   //       console.error("Error fetching connections:", error);
   //    });
   // }, [dispatch]);

   // const fetchSuggestedFriends = async () => {
   //    // Implement fetching suggested friends
   //    // For now, we'll use mock data
   //    const mockFriends = [
   //       { id: 1, name: "John Doe", interests: ["JavaScript", "React"], mutualFriends: 5, isFollowing: false },
   //       { id: 2, name: "Jane Smith", interests: ["Python", "Machine Learning"], mutualFriends: 3, isFollowing: true },
   //       // Add more mock friends as needed
   //    ];
   //    setSuggestedFriends(mockFriends);
   // };

   const handleEditClick = () => {
      setIsEditing(true);
   };

   const handleSaveClick = async () => {
      try {
         const token = localStorage.getItem("token");
         if (!token) {
            throw new Error("No authentication token found");
         }

         const updatedUserData = {
            username: editedUser.username,
            email: editedUser.email,
            profilePicture: editedUser.profilePicture,
            title: editedUser.title,
            location: editedUser.location,
            bio: editedUser.bio,
            learningGoals: editedUser.learningGoals,
            skills: editedUser.skills,
            work: editedUser.work,
            education: editedUser.education,
            website: editedUser.website,
         };

         const response = await axios.put(`${API_URL}/users/profile`, updatedUserData, {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.status === 200) {
            dispatch(setUser(response.data));
            setIsEditing(false);
         } else {
            throw new Error("Failed to update profile");
         }
      } catch (error) {
         console.error("Error updating profile:", error);
         // Handle error (e.g., show error message to user)
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [name]: value,
      }));
   };

   const handleNestedInputChange = (e, nestedField) => {
      const { name, value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [nestedField]: {
            ...prevUser[nestedField],
            [name]: value,
         },
      }));
   };

   const handleArrayInputChange = (e, field) => {
      const { value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [field]: value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      }));
   };

   const handleFollow = async (friendId) => {
      try {
         const token = localStorage.getItem("token");
         const response = await fetch(`${API_URL}/users/follow/${friendId}`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const updatedUser = await response.json();

            if (updatedUser && updatedUser.user) {
               dispatch(setUser(updatedUser.user));
            }
            // Update local state
            setSuggestedConnections((prevConnections) =>
               prevConnections.map((connection) => (connection._id === friendId ? { ...connection, isFollowing: true } : connection)),
            );
         } else {
            console.error("Failed to follow user");
         }
      } catch (error) {
         console.error("Error following user:", error);
      }
   };

   const handleUnfollow = async (friendId) => {
      try {
         const token = localStorage.getItem("token");
         const response = await fetch(`${API_URL}/users/unfollow/${friendId}`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const updatedUser = await response.json();

            if (updatedUser && updatedUser.user) {
               dispatch(setUser(updatedUser.user));
            }

            // Update local state
            // Update local state
            setSuggestedConnections((prevConnections) =>
               prevConnections.map((connection) => (connection._id === friendId ? { ...connection, isFollowing: false } : connection)),
            );
         } else {
            console.error("Failed to unfollow user");
         }
      } catch (error) {
         console.error("Error unfollowing user:", error);
      }
   };
   const handleConnectionsClick = (tab) => {
      setActiveTab(tab);
      setShowConnectionsModal(true);
   };

   const ConnectionsModal = () => {
      let connections = [];
      if (user && user?.followers && user?.following) {
         connections = activeTab === "followers" ? user.followers : user.following;
      }
      const isFollowing = (id) => {
         return connections.some((connection) => connection._id === id);
      };
      
      return (
         <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
               <div className={styles.modalHeader}>
                  <h2>{activeTab === "followers" ? "Followers" : "Following"}</h2>
                  <button className={styles.closeButton} onClick={() => setShowConnectionsModal(false)}>
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
               </div>
               <div className={styles.tabButtons}>
                  <button
                     className={`${styles.tabButton} ${activeTab === "followers" ? styles.activeTab : ""}`}
                     onClick={() => setActiveTab("followers")}>
                     Followers
                  </button>
                  <button
                     className={`${styles.tabButton} ${activeTab === "following" ? styles.activeTab : ""}`}
                     onClick={() => setActiveTab("following")}>
                     Following
                  </button>
               </div>
               <ul className={styles.connectionsList}>
                  {connections.length > 0 ? (
                     connections.map((connection) => (
                        <li key={connection.id} className={styles.connectionItem}>
                           <img
                              src={connection.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${connection.username}`}
                              alt={connection.username}
                              className={styles.connectionAvatar}
                           />
                           <div className={styles.connectionInfo}>
                              <h4>{connection.username}</h4>
                              <p>{connection.title}</p>
                           </div>
                           {activeTab === "followers" ? (
                              isFollowing(connection.id) ? (
                                 <button className={styles.unfollowBtn} onClick={() => handleUnfollow(connection.id)}>
                                    <FontAwesomeIcon icon={faUserMinus} /> Unfollow
                                 </button>
                              ) : (
                                 <button className={styles.followBtn} onClick={() => handleFollow(connection.id)}>
                                    <FontAwesomeIcon icon={faUserPlus} /> Follow
                                 </button>
                              )
                           ) : (
                              <button className={styles.unfollowBtn} onClick={() => handleUnfollow(connection.id)}>
                                 <FontAwesomeIcon icon={faUserMinus} /> Unfollow
                              </button>
                           )}
                        </li>
                     ))
                  ) : (
                     <li className={styles.noConnectionsMessage}>
                        {activeTab === "followers"
                           ? "No followers found. Start engaging with the community to gain followers!"
                           : "You're not following anyone yet. Explore and connect with other users!"}
                     </li>
                  )}
               </ul>
            </div>
         </div>
      );
   };

   return (
      <div className={styles.userProfile}>
         <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
               <img
                  src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                  alt={user.username}
                  className={styles.avatar}
               />
               <div className={styles.profileInfo}>
                  <h2 className={styles.name}>{user.username}</h2>
                  <p className={styles.title}>{user.title ? user.title : user.role}</p>
                  <p className={styles.location}>
                     <FontAwesomeIcon icon={faMapMarkerAlt} /> {user.location}
                  </p>
               </div>
               <button className={styles.editButton} onClick={handleEditClick}>
                  <FontAwesomeIcon icon={faPen} />
               </button>
            </div>
            <div className={styles.bio}>
               <p>{user.bio}</p>
            </div>
            <div className={styles.stats}>
               <div className={styles.stat} onClick={() => handleConnectionsClick("followers")}>
                  <span className={styles.statNumber}>{user.followers?.length || 0}</span>
                  <span className={styles.statLabel}>Followers</span>
               </div>
               <div className={styles.stat} onClick={() => handleConnectionsClick("following")}>
                  <span className={styles.statNumber}>{user.following?.length || 0}</span>
                  <span className={styles.statLabel}>Following</span>
               </div>
            </div>
            <div className={styles.details}>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faBriefcase} className={styles.detailIcon} />
                  <div>
                     <h4>Work</h4>
                     <p>
                        {user.work?.title} at {user.work?.company}
                     </p>
                     <p>
                        {user.work?.startDate} - {user.work?.endDate}
                     </p>
                     <p>{user.work?.description}</p>
                  </div>
               </div>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faGraduationCap} className={styles.detailIcon} />
                  <div>
                     <h4>Education</h4>
                     <p>{user.education?.degree}</p>
                     <p>
                        {user.education?.school}, {user.education?.graduationYear}
                     </p>
                  </div>
               </div>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faCode} className={styles.detailIcon} />
                  <div>
                     <h4>Skills</h4>
                     <p>{user.skills?.join(", ")}</p>
                  </div>
               </div>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faLink} className={styles.detailIcon} />
                  <div>
                     <h4>Website</h4>
                     <a href={`https://${user.website}`} target='_blank' rel='noopener noreferrer'>
                        {user.website}
                     </a>
                  </div>
               </div>
            </div>
         </div>

         <div className={styles.suggestedFriendsSection}>
            <h3>Suggested Connections</h3>
            <div className={styles.searchBar}>
               <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
               <input type='text' placeholder='Search connections...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {isLoadingSuggestions ? (
               <p className={styles.loadingText}>Loading suggested connections...</p>
            ) : suggestionsError ? (
               <p className={styles.errorMessage}>{suggestionsError}</p>
            ) : filteredConnections.length === 0 ? (
               <p className={styles.noResults}>No connections found matching your search.</p>
            ) : (
               <ul className={styles.friendList}>
                  {filteredConnections.map((connection) => (
                     <li key={connection._id} className={styles.friendItem}>
                        <img
                           src={connection.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${connection.username}`}
                           alt={connection.username}
                           className={styles.friendAvatar}
                        />
                        <div className={styles.friendInfo}>
                           <h4>{connection.username}</h4>
                           <p className={styles.title}>{connection.title}</p>
                           <p className={styles.commonInterests}>
                              <FontAwesomeIcon icon={faLightbulb} className={styles.interestIcon} />
                              {connection.commonInterests} common interests
                           </p>
                           <ul className={styles.reasons}>
                              {connection.reasons.map((reason, index) => (
                                 <li key={index}>
                                    <FontAwesomeIcon icon={faCode} className={styles.reasonIcon} />
                                    {reason}
                                 </li>
                              ))}
                           </ul>
                        </div>
                        <button className={styles.followBtn} onClick={() => handleFollow(connection._id)}>
                           <FontAwesomeIcon icon={faUserPlus} />
                           Follow
                        </button>
                     </li>
                  ))}
               </ul>
            )}
         </div>

         {isEditing && editedUser && (
            <div className={styles.editModal}>
               <div className={styles.editModalContent}>
                  <div className={styles.editModalHeader}>
                     <h2>Edit Profile</h2>
                     <button className={styles.closeButton} onClick={() => setIsEditing(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                     </button>
                  </div>
                  <input type='text' name='username' value={editedUser.username} onChange={handleInputChange} placeholder='Username' />
                  <input type='email' name='email' value={editedUser.email} onChange={handleInputChange} placeholder='Email' />
                  <input
                     type='text'
                     name='profilePicture'
                     value={editedUser.profilePicture}
                     onChange={handleInputChange}
                     placeholder='Profile Picture URL'
                  />
                  <input
                     type='text'
                     name='title'
                     value={editedUser.title || ""}
                     onChange={handleInputChange}
                     placeholder='Your Role (eg. React Developer)'
                  />
                  <input type='text' name='location' value={editedUser.location} onChange={handleInputChange} placeholder='Location' />
                  <textarea name='bio' value={editedUser.bio} onChange={handleInputChange} placeholder='Bio' />
                  <input
                     type='text'
                     name='learningGoals'
                     value={editedUser.learningGoals?.join(", ") || ""}
                     onChange={(e) => handleArrayInputChange(e, "learningGoals")}
                     placeholder='Learning Goals (comma-separated)'
                  />
                  <input
                     type='text'
                     name='skills'
                     value={editedUser.skills?.join(", ") || ""}
                     onChange={(e) => handleArrayInputChange(e, "skills")}
                     placeholder='Skills (comma-separated)'
                  />
                  <h4>Work</h4>
                  <input
                     type='text'
                     name='title'
                     value={editedUser.work?.title || ""}
                     onChange={(e) => handleNestedInputChange(e, "work")}
                     placeholder='Work Title'
                  />
                  <input
                     type='text'
                     name='company'
                     value={editedUser.work?.company || ""}
                     onChange={(e) => handleNestedInputChange(e, "work")}
                     placeholder='Company'
                  />
                  <input
                     type='text'
                     name='startDate'
                     value={editedUser.work?.startDate || ""}
                     onChange={(e) => handleNestedInputChange(e, "work")}
                     placeholder='Start Date'
                  />
                  <input
                     type='text'
                     name='endDate'
                     value={editedUser.work?.endDate || ""}
                     onChange={(e) => handleNestedInputChange(e, "work")}
                     placeholder='End Date'
                  />
                  <textarea
                     name='description'
                     value={editedUser.work?.description || ""}
                     onChange={(e) => handleNestedInputChange(e, "work")}
                     placeholder='Work Description'
                  />
                  <h4>Education</h4>
                  <input
                     type='text'
                     name='degree'
                     value={editedUser.education?.degree || ""}
                     onChange={(e) => handleNestedInputChange(e, "education")}
                     placeholder='Degree'
                  />
                  <input
                     type='text'
                     name='school'
                     value={editedUser.education?.school || ""}
                     onChange={(e) => handleNestedInputChange(e, "education")}
                     placeholder='School'
                  />
                  <input
                     type='text'
                     name='graduationYear'
                     value={editedUser.education?.graduationYear || ""}
                     onChange={(e) => handleNestedInputChange(e, "education")}
                     placeholder='Graduation Year'
                  />
                  <input
                     type='text'
                     name='website'
                     value={editedUser.website || ""}
                     onChange={handleInputChange}
                     placeholder='Your Website Link (eg. www.xyz.com)'
                  />
                  <div className={styles.editModalButtons}>
                     <button onClick={() => setIsEditing(false)}>Cancel</button>
                     <button onClick={handleSaveClick}>Save</button>
                  </div>
               </div>
            </div>
         )}

         {showConnectionsModal && <ConnectionsModal />}
      </div>
   );
}

export default UserProfile;
