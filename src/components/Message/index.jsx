import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPaperPlane, faEllipsisV, faPaperclip, faSmile } from "@fortawesome/free-solid-svg-icons";
import styles from "./Message.module.css";

function Message() {
   const [selectedChat, setSelectedChat] = useState(null);
   const [messageInput, setMessageInput] = useState("");

   const chats = [
      { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", time: "10:30 AM", unread: 2 },
      { id: 2, name: "Jane Smith", lastMessage: "The project is due tomorrow", time: "Yesterday", unread: 0 },
      { id: 3, name: "Bob Johnson", lastMessage: "Can we schedule a meeting?", time: "Monday", unread: 1 },
   ];

   const messages = [
      { id: 1, sender: "John Doe", content: "Hey, how are you?", time: "10:30 AM", isSent: false },
      { id: 2, sender: "You", content: "I'm good, thanks! How about you?', time: '10:31 AM", isSent: true },
      { id: 3, sender: "John Doe", content: "Doing well. Did you finish the report?", time: "10:32 AM", isSent: false },
   ];

   const handleChatSelect = (chatId) => {
      setSelectedChat(chatId);
   };

   const handleSendMessage = (e) => {
      e.preventDefault();
      if (messageInput.trim()) {
         console.log("Sending message:", messageInput);
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
               {chats.map((chat) => (
                  <div
                     key={chat.id}
                     className={`${styles.chatItem} ${selectedChat === chat.id ? styles.active : ""}`}
                     onClick={() => handleChatSelect(chat.id)}>
                     <div className={styles.avatar}>{chat.name[0]}</div>
                     <div className={styles.chatInfo}>
                        <h4>{chat.name}</h4>
                        <p>{chat.lastMessage}</p>
                     </div>
                     <div className={styles.chatMeta}>
                        <span>{chat.time}</span>
                        {chat.unread > 0 && <div className={styles.unreadBadge}>{chat.unread}</div>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className={styles.chatArea}>
            {selectedChat ? (
               <>
                  <div className={styles.chatHeader}>
                     <div className={styles.avatar}>{chats.find((chat) => chat.id === selectedChat).name[0]}</div>
                     <h3>{chats.find((chat) => chat.id === selectedChat).name}</h3>
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
