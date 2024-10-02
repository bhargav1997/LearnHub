import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPaperPlane, faEllipsisV, faPaperclip, faSmile } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import styles from "./Message.module.css";
import { useNavigate } from "react-router-dom";

function Message() {
   const [selectedChat, setSelectedChat] = useState(null);
   const [messageInput, setMessageInput] = useState("");
   const [socket, setSocket] = useState(null);
   const [messages, setMessages] = useState([]);
   const [connections, setConnections] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
         navigate("/login");
         return;
      }

      fetchConnections(token);

      const newSocket = io("http://localhost:5073", {
         auth: { token },
      });

      newSocket.on("connect", () => {
         console.log("Connected to server");
      });

      newSocket.on("connect_error", (err) => {
         console.error("Connection error:", err.message);
         if (err.message === "Invalid token") {
            localStorage.removeItem("token");
            navigate("/login");
         }
      });

      newSocket.on("receive_message", (message) => {
         setMessages((prevMessages) => [...prevMessages, message]);
      });

      setSocket(newSocket);

      return () => {
         newSocket.disconnect();
      };
   }, [navigate]);

   const fetchConnections = async (token) => {
      try {
         const response = await fetch("http://localhost:5073/api/users/connections", {
            method: "GET",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const data = await response.json();
            setConnections(data);
         } else if (response.status === 401) {
            console.error("Unauthorized: Invalid token");
            localStorage.removeItem("token");
            navigate("/login");
         } else {
            console.error("Failed to fetch connections");
         }
      } catch (error) {
         console.error("Error fetching connections:", error);
      }
   };

   const handleChatSelect = (chatId) => {
      setSelectedChat(chatId);
      if (socket) {
         socket.emit("join_room", chatId);
      }
   };

   const handleSendMessage = (e) => {
      e.preventDefault();
      if (messageInput.trim() && socket && selectedChat) {
         const newMessage = {
            id: Date.now(),
            sender: "You",
            content: messageInput,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isSent: true,
         };
         socket.emit("send_message", { roomId: selectedChat, message: newMessage });
         setMessages((prevMessages) => [...prevMessages, newMessage]);
         setMessageInput("");
      }
   };

   return (
      <div className={styles.messageContainer}>
         <div className={styles.sidebar}>
            <div className={styles.searchBarWrapper}>
               <div className={styles.searchBar}>
                  <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                  <input type='text' placeholder='Search messages' />
               </div>
            </div>
            <div className={styles.chatList}>
               {connections.map((connection) => (
                  <div
                     key={connection._id}
                     className={`${styles.chatItem} ${selectedChat === connection._id ? styles.active : ""}`}
                     onClick={() => handleChatSelect(connection._id)}>
                     <div className={styles.avatar}>{connection.username[0].toUpperCase()}</div>
                     <div className={styles.chatInfo}>
                        <h4>{connection.username}</h4>
                        <p>{connection.email}</p>
                     </div>
                     <div className={styles.chatMeta}>
                        <span>{new Date(connection.lastActive).toLocaleDateString()}</span>
                        {connection.isFollower && <div className={styles.followerBadge}>Follower</div>}
                        {connection.isFollowing && <div className={styles.followingBadge}>Following</div>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className={styles.chatArea}>
            {selectedChat ? (
               <>
                  <div className={styles.chatHeader}>
                     <div className={styles.avatar}>
                        {connections.find((connection) => connection._id === selectedChat)?.username[0].toUpperCase()}
                     </div>
                     <h3>{connections.find((connection) => connection._id === selectedChat)?.username}</h3>
                     <button className={styles.moreOptions}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                     </button>
                  </div>
                  <div className={styles.messageList}>
                     {messages.map((message) => (
                        <div key={message.id} className={`${styles.message} ${message.isSent ? styles.sent : styles.received}`}>
                           <p>{message.content}</p>
                           <span className={styles.messageTime}>{message.time}</span>
                        </div>
                     ))}
                  </div>
                  <div className={styles.messageInputWrapper}>
                     <button className={styles.attachButton}>
                        <FontAwesomeIcon icon={faPaperclip} />
                     </button>
                     <form className={styles.messageInput} onSubmit={handleSendMessage}>
                        <input
                           type='text'
                           placeholder='Type a message...'
                           value={messageInput}
                           onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button type='button' className={styles.emojiButton}>
                           <FontAwesomeIcon icon={faSmile} />
                        </button>
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
