import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import "./ChatPopup.css";

const ChatPopup = ({ groupId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [groupName, setGroupName] = useState("");
  const loggedInUser = auth.currentUser?.email;
  const messagesEndRef = useRef(null);

  // Auto scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkMembership = async () => {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        setGroupName(groupData.name || "Group Chat");
        setIsMember(groupData.members.includes(loggedInUser));
      }
    };

    checkMembership();
  }, [groupId, loggedInUser]);

  useEffect(() => {
    if (!isMember) return; // Prevent loading messages if user is not a member

    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId, isMember]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !isMember) return;

    const messagesRef = collection(db, "groups", groupId, "messages");
    await addDoc(messagesRef, {
      sender: loggedInUser,
      text: message,
      timestamp: new Date(),
    });

    setMessage("");
  };

  // Format timestamp to readable time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from current user
  const isOwnMessage = (sender) => {
    return sender === loggedInUser;
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <div className="group-info">
          <h3>{groupName}</h3>
        </div>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {isMember ? (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSender = isOwnMessage(msg.sender);
                return (
                  <div 
                    key={msg.id} 
                    className={`message-container ${isSender ? 'sender' : 'receiver'}`}
                  >
                    {!isSender && (
                      <div className="message-sender">{msg.sender.split('@')[0]}</div>
                    )}
                    <div className={`message ${isSender ? 'sent' : 'received'}`}>
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </>
      ) : (
        <div className="not-member">
          <p>You are not a member of this group.</p>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;