import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import "./ChatPopup.css"; // Import CSS

const ChatPopup = ({ groupId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMember, setIsMember] = useState(false);
  const loggedInUser = auth.currentUser?.email;

  useEffect(() => {
    const checkMembership = async () => {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        setIsMember(groupData.members.includes(loggedInUser));
      }
    };

    checkMembership();
  }, [groupId, loggedInUser]);

  useEffect(() => {
    if (!isMember) return; // Prevent loading messages if user is not a member

    const messagesRef = collection(db, "groups", groupId, "messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId, isMember]);

  const sendMessage = async () => {
    if (!message.trim() || !isMember) return;

    const messagesRef = collection(db, "groups", groupId, "messages");
    await addDoc(messagesRef, {
      sender: loggedInUser,
      text: message,
      timestamp: new Date(),
    });

    setMessage("");
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>Group Chat</span>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {isMember ? (
        <>
          <div className="chat-messages">
            {messages.map((msg) => (
              <p key={msg.id} className={msg.sender === loggedInUser ? "sent" : "received"}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={sendMessage}>Send</button>
          </div>
        </>
      ) : (
        <p className="not-member">You are not a member of this group.</p>
      )}
    </div>
  );
};

export default ChatPopup;
