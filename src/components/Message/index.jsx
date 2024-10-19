import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPaperPlane, faEllipsisV, faPaperclip, faSmile, faUserFriends, faTrash } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
import styles from "./Message.module.css";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "../../config";
import { useSelector } from "react-redux";
import { fetchUserConnections } from "../../api/userApi";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

function Message() {
   const API_URL = CONFIG.API_URL;
   const { user } = useSelector((state) => state.user);
   const [selectedChat, setSelectedChat] = useState(null);
   const [messageInput, setMessageInput] = useState("");
   const [socket, setSocket] = useState(null);
   const [messages, setMessages] = useState([]);
   const [connections, setConnections] = useState([]);
   const [isTyping, setIsTyping] = useState(false);
   const navigate = useNavigate();
   const messagesEndRef = useRef(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [showDropdown, setShowDropdown] = useState(false);
   const dropdownRef = useRef(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const searchTimeoutRef = useRef(null);

   const initializeSocket = useCallback(() => {
      const token = localStorage.getItem("token");
      if (!token) {
         console.log("No token found, navigating to login");
         navigate("/login");
         return null;
      }

      const newSocket = io(CONFIG.SOCKET_URL, {
         auth: { token },
         transports: ["websocket"],
      });

      newSocket.on("connect", () => {
         console.log("Connected to server");
         newSocket.emit("user_online");
      });

      newSocket.on("connect_error", (err) => {
         console.error("Connection error:", err.message);
         if (err.message === "Authentication error") {
            // localStorage.removeItem("token");
            // navigate("/login");
         }
      });

      return newSocket;
   }, [API_URL, navigate]);

   const fetchChatHistory = useCallback(
      async (recipientId) => {
         try {
            const response = await axios.get(`${API_URL}/chat/history/${recipientId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            console.log("Fetched messages:", response.data);
            setMessages(response.data);
         } catch (error) {
            console.error("Error fetching chat history:", error);
         }
      },
      [API_URL],
   );

   const handleSearch = useCallback(async (term) => {
      if (term.trim() === "") {
         setSearchResults([]);
         return;
      }

      try {
         const response = await axios.get(`${API_URL}/users/search-connections?term=${term}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });
         setSearchResults(response.data);
      } catch (error) {
         console.error("Error searching connections:", error);
      }
   }, [API_URL]);

   const handleSearchInputChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
         clearTimeout(searchTimeoutRef.current);
      }

      // Set a new timeout
      searchTimeoutRef.current = setTimeout(() => {
         handleSearch(term);
      }, 500); // 500ms delay
   };

   useEffect(() => {
      fetchUserConnections()
         .then((data) => setConnections(data))
         .catch((error) => console.error("Error fetching user connections:", error));

      const newSocket = initializeSocket();
      if (newSocket) {
         setSocket(newSocket);

         newSocket.on("private_message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
         });

         newSocket.on("user_status", ({ userId, status }) => {
            setConnections((prevConnections) => prevConnections.map((conn) => (conn._id === userId ? { ...conn, status } : conn)));
         });

         newSocket.on("typing_status", ({ userId, status }) => {
            if (selectedChat === userId) {
               setIsTyping(status === "typing");
            }
         });

         return () => {
            newSocket.emit("user_offline");
            newSocket.off("private_message");
            newSocket.disconnect();
         };
      }
   }, [initializeSocket, selectedChat]);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const handleChatSelect = useCallback(
      async (chatId) => {
         setSelectedChat(chatId);
         if (socket) {
            socket.emit("join_room", chatId);
         }
         await fetchChatHistory(chatId);
      },
      [socket, fetchChatHistory],
   );

   const sendPrivateMessage = useCallback(
      async (recipientId, message) => {
         if (message.trim() && socket && recipientId) {
            try {
               const response = await axios.post(
                  `${API_URL}/chat/private`,
                  {
                     recipientId,
                     message,
                  },
                  {
                     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  },
               );

               // Add the sent message to the state
               // setMessages((prevMessages) => [...prevMessages, response.data]);

               socket.emit("private_message", response.data);

               setMessageInput("");
               socket.emit("typing_end", recipientId);
            } catch (error) {
               console.error("Error sending private message:", error);
            }
         }
      },
      [socket, API_URL],
   );

   const handleInputChange = useCallback(
      (e) => {
         setMessageInput(e.target.value);
         if (socket && selectedChat) {
            socket.emit("typing_start", selectedChat);
            setTimeout(() => {
               socket.emit("typing_end", selectedChat);
            }, 2000);
         }
      },
      [socket, selectedChat],
   );

   const onEmojiClick = (emojiObject) => {
      setMessageInput((prevInput) => prevInput + emojiObject.emoji);
      setShowEmojiPicker(false);
   };

   const clearPrivateChat = useCallback(
      async (recipientId) => {
         try {
            const response = await fetch(`${API_URL}/chat/clear-private-chat/${recipientId}`, {
               method: "DELETE",
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
               },
            });

            const data = await response.json();

            if (response.ok) {
               if (!data.error) {
                  setMessages([]); // Clear messages in the UI
                  setShowDropdown(false); // Close the dropdown
                  toast.success("Chat history cleared");
               } else {
                  console.error(data.message);
                  toast.error(data.message);
               }
            } else {
               console.error(data.message);
               toast.error("Something went wrong, please try again.");
            }
         } catch (error) {
            console.error("Error clearing private chat:", error);
            toast.error("Something went wrong, please try again.");
         }
      },
      [API_URL],
   );

   const clearChat = useCallback(() => {
      if (selectedChat) {
         clearPrivateChat(selectedChat);
      }
   }, [selectedChat, clearPrivateChat]);

   useEffect(() => {
      function handleClickOutside(event) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   console.log("user", user);
   console.log("messages", messages);

   return (
      <div className={styles.messageContainer}>
         <div className={styles.sidebar}>
            <div className={styles.searchBarWrapper}>
               <div className={styles.searchBar}>
                  <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                  <input 
                     type='text' 
                     placeholder='Search Connections...' 
                     value={searchTerm}
                     onChange={handleSearchInputChange}
                  />
               </div>
            </div>
            <div className={styles.chatList}>
               {(searchTerm ? searchResults : connections).map((connection) => (
                  <div
                     key={connection._id}
                     className={`${styles.chatItem} ${selectedChat === connection._id ? styles.active : ""}`}
                     onClick={() => handleChatSelect(connection._id)}>
                     <div className={styles.avatar}>
                        {connection.profilePicture ? (
                           <img src={connection.profilePicture} alt={connection.username} className={styles.avatarImage} />
                        ) : (
                           connection.username[0].toUpperCase()
                        )}
                     </div>
                     <div className={styles.chatInfo}>
                        <h4>{connection.username}</h4>
                        <p>{connection.title || connection.email}</p>
                     </div>
                     <div className={styles.chatMeta}>
                        <div className={styles.connectionStatus}>
                           {connection.isFollower && connection.isFollowing ? (
                              <FontAwesomeIcon icon={faUserFriends} className={styles.mutualIcon} title='Mutual Connection' />
                           ) : connection.isFollower ? (
                              <span className={styles.followerBadge} title='Follower'>
                                 F
                              </span>
                           ) : connection.isFollowing ? (
                              <span className={styles.followingBadge} title='Following'>
                                 F
                              </span>
                           ) : null}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className={styles.chatArea}>
            {selectedChat ? (
               <>
                  <div className={styles.chatHeader}>
                     <div className={styles.chatHeaderLeft}>
                        <div className={styles.avatar}>
                           {connections.find((connection) => connection._id === selectedChat)?.username[0].toUpperCase()}
                        </div>
                        <h3>{connections.find((connection) => connection._id === selectedChat)?.username}</h3>
                     </div>
                     <div className={styles.chatHeaderRight}>
                        <div className={styles.dropdownContainer} ref={dropdownRef}>
                           <button className={styles.moreOptions} onClick={() => setShowDropdown(!showDropdown)}>
                              <FontAwesomeIcon icon={faEllipsisV} />
                           </button>
                           {showDropdown && (
                              <div className={styles.dropdownMenu}>
                                 <button onClick={clearChat}>
                                    <FontAwesomeIcon icon={faTrash} /> Clear Chat
                                 </button>
                                 {/* Add more options here as needed */}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className={styles.messageList}>
                     {messages.map((message, index) => (
                        <div
                           key={index}
                           className={`${styles.message} ${
                              message?.sender?._id === user._id || message?.senderId === user._id ? styles.sent : styles.received
                           }`}>
                           <p>{message.message}</p>
                           <span className={styles.messageTime}>
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                           </span>
                        </div>
                     ))}
                     {isTyping && <div className={styles.typingIndicator}>Typing...</div>}
                     <div ref={messagesEndRef} />
                  </div>
                  <div className={styles.messageInputWrapper}>
                     <button className={styles.attachButton}>
                        <FontAwesomeIcon icon={faPaperclip} />
                     </button>
                     <form
                        className={styles.messageInput}
                        onSubmit={(e) => {
                           e.preventDefault();
                           sendPrivateMessage(selectedChat, messageInput);
                        }}>
                        <input type='text' placeholder='Type a message...' value={messageInput} onChange={handleInputChange} />
                        <div className={styles.emojiPickerContainer}>
                           <button type='button' className={styles.emojiButton} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                              <FontAwesomeIcon icon={faSmile} />
                           </button>
                           {showEmojiPicker && (
                              <div className={styles.emojiPickerWrapper}>
                                 <EmojiPicker onEmojiClick={onEmojiClick} />
                              </div>
                           )}
                        </div>
                        <button type='submit' className={styles.sendButton}>
                           <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                     </form>
                  </div>
               </>
            ) : (
               <div className={styles.noChatSelected}>
                  <h2>Select a chat to start messaging</h2>
               </div>
            )}
         </div>
      </div>
   );
}

export default Message;
