import { useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faUserPlus,
   faSearch,
   faCode,
   faGraduationCap,
   faBriefcase,
   faMapMarkerAlt,
   faLink,
   faPen,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./UserProfile.module.css";

function UserProfile() {
   // Mock currentUser data
   const mockUser = {
      username: "John Doe",
      title: "Senior Software Developer",
      location: "San Francisco, CA",
      bio: "Passionate about creating innovative solutions and mentoring junior developers. Always excited to learn new technologies and contribute to open-source projects.",
      learningHours: 1234,
      coursesCompleted: 56,
      connections: 789,
      work: {
         title: "Senior Software Developer",
         company: "TechCorp Inc.",
         startDate: "Jan 2018",
         endDate: "Present",
         description: "Leading a team of developers in creating cutting-edge web applications using React and Node.js.",
      },
      education: {
         degree: "M.S. in Computer Science",
         school: "Stanford University",
         graduationYear: "2016",
      },
      skills: ["React", "Node.js", "Python", "AWS", "Docker", "Machine Learning"],
      website: "www.johndoe.com",
   };

   const [user, setUser] = useState(mockUser);
   const dispatch = useDispatch();
   const [searchQuery, setSearchQuery] = useState("");
   const [isEditing, setIsEditing] = useState(false);
   const [editedUser, setEditedUser] = useState(user);

   // Mock data for suggested friends
   const allFriends = [
      { id: 1, name: "Alice Johnson", interests: ["React", "Node.js"], mutualFriends: 5 },
      { id: 2, name: "Bob Smith", interests: ["Python", "Machine Learning"], mutualFriends: 3 },
      { id: 3, name: "Carol White", interests: ["JavaScript", "Vue.js"], mutualFriends: 7 },
      { id: 4, name: "David Brown", interests: ["Java", "Spring Boot"], mutualFriends: 2 },
      { id: 5, name: "Eva Green", interests: ["Angular", "TypeScript"], mutualFriends: 4 },
   ];

   const filteredFriends = allFriends.filter(
      (friend) =>
         friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         friend.interests.some((interest) => interest.toLowerCase().includes(searchQuery.toLowerCase())),
   );

   const handleEditClick = () => {
      setIsEditing(true);
   };

   const handleSaveClick = () => {
      // Here you would typically dispatch an action to update the user in your Redux store
      // and send the updated data to your backend
      dispatch({ type: "UPDATE_USER", payload: editedUser });
      setIsEditing(false);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedUser({ ...editedUser, [name]: value });
   };

   if (!user) {
      return <div>Please log in to view your profile.</div>;
   }

   return (
      <div className={styles.userProfile}>
         <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
               <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} alt={user.username} className={styles.avatar} />
               <div className={styles.profileInfo}>
                  <h2 className={styles.name}>{user.username}</h2>
                  <p className={styles.title}>{user.title}</p>
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
               <div className={styles.stat}>
                  <span className={styles.statNumber}>{user.learningHours}</span>
                  <span className={styles.statLabel}>Learning Hours</span>
               </div>
               <div className={styles.stat}>
                  <span className={styles.statNumber}>{user.coursesCompleted}</span>
                  <span className={styles.statLabel}>Courses Completed</span>
               </div>
               <div className={styles.stat}>
                  <span className={styles.statNumber}>{user.connections}</span>
                  <span className={styles.statLabel}>Connections</span>
               </div>
            </div>
            <div className={styles.details}>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faBriefcase} className={styles.detailIcon} />
                  <div>
                     <h4>Work</h4>
                     <p>
                        {user.work.title} at {user.work.company}
                     </p>
                     <p>
                        {user.work.startDate} - {user.work.endDate}
                     </p>
                     <p>{user.work.description}</p>
                  </div>
               </div>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faGraduationCap} className={styles.detailIcon} />
                  <div>
                     <h4>Education</h4>
                     <p>{user.education.degree}</p>
                     <p>
                        {user.education.school}, {user.education.graduationYear}
                     </p>
                  </div>
               </div>
               <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faCode} className={styles.detailIcon} />
                  <div>
                     <h4>Skills</h4>
                     <p>{user.skills.join(", ")}</p>
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

         <div className={styles.friendSection}>
            <h3>Find Friends</h3>
            <div className={styles.searchBar}>
               <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
               <input
                  type='text'
                  placeholder='Search friends by name or interest...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
               />
            </div>

            <h3>Suggested Friends</h3>
            {filteredFriends.length === 0 ? (
               <p className={styles.noResults}>No friends found matching your search.</p>
            ) : (
               <ul className={styles.friendList}>
                  {filteredFriends.map((friend) => (
                     <li key={friend.id} className={styles.friendItem}>
                        <img
                           src={`https://api.dicebear.com/6.x/initials/svg?seed=${friend.name}`}
                           alt={friend.name}
                           className={styles.friendAvatar}
                        />
                        <div className={styles.friendInfo}>
                           <h4>{friend.name}</h4>
                           <p className={styles.interests}>
                              <FontAwesomeIcon icon={faCode} className={styles.interestIcon} />
                              {friend.interests.join(", ")}
                           </p>
                           <p className={styles.mutualFriends}>{friend.mutualFriends} mutual friends</p>
                        </div>
                        <button className={styles.addFriendBtn}>
                           <FontAwesomeIcon icon={faUserPlus} />
                           Add Friend
                        </button>
                     </li>
                  ))}
               </ul>
            )}
         </div>
         {isEditing && (
            <div className={styles.editModal}>
               <div className={styles.editModalContent}>
                  <h2>Edit Profile</h2>
                  <input type='text' name='username' value={editedUser.username} onChange={handleInputChange} placeholder='Username' />
                  <input type='text' name='title' value={editedUser.title} onChange={handleInputChange} placeholder='Title' />
                  <input type='text' name='location' value={editedUser.location} onChange={handleInputChange} placeholder='Location' />
                  <textarea name='bio' value={editedUser.bio} onChange={handleInputChange} placeholder='Bio' />
                  <input
                     type='text'
                     name='work.title'
                     value={editedUser.work.title}
                     onChange={handleInputChange}
                     placeholder='Work Title'
                  />
                  <input
                     type='text'
                     name='work.company'
                     value={editedUser.work.company}
                     onChange={handleInputChange}
                     placeholder='Company'
                  />
                  <input
                     type='text'
                     name='work.startDate'
                     value={editedUser.work.startDate}
                     onChange={handleInputChange}
                     placeholder='Start Date'
                  />
                  <input
                     type='text'
                     name='work.endDate'
                     value={editedUser.work.endDate}
                     onChange={handleInputChange}
                     placeholder='End Date'
                  />
                  <input
                     type='text'
                     name='education.degree'
                     value={editedUser.education.degree}
                     onChange={handleInputChange}
                     placeholder='Degree'
                  />
                  <input
                     type='text'
                     name='education.school'
                     value={editedUser.education.school}
                     onChange={handleInputChange}
                     placeholder='School'
                  />
                  <input
                     type='text'
                     name='education.graduationYear'
                     value={editedUser.education.graduationYear}
                     onChange={handleInputChange}
                     placeholder='Graduation Year'
                  />
                  <input
                     type='text'
                     name='skills'
                     value={editedUser.skills.join(", ")}
                     onChange={(e) => setEditedUser({ ...editedUser, skills: e.target.value.split(", ") })}
                     placeholder='Skills (comma-separated)'
                  />
                  <input type='text' name='website' value={editedUser.website} onChange={handleInputChange} placeholder='Website' />
                  <div className={styles.editModalButtons}>
                     <button onClick={() => setIsEditing(false)}>Cancel</button>
                     <button onClick={handleSaveClick}>Save</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default UserProfile;
