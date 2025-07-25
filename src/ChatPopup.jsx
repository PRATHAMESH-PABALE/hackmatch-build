import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import CryptoJS from 'crypto-js'; // Import crypto-js
import "./ChatPopup.css";

// !!! IMPORTANT: In a real application, NEVER hardcode secret keys like this. !!!
// Keys should be securely managed (e.g., derived from user passwords,
// exchanged via a secure key exchange protocol, or managed by a dedicated
// E2EE library/service like Virgil Security).
const ENCRYPTION_SECRET_KEY = "your-super-secret-chat-key-12345";

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
        setIsMember(groupData.members && groupData.members.includes(loggedInUser));
      }
    };

    checkMembership();
  }, [groupId, loggedInUser]);

  useEffect(() => {
    if (!isMember) return;

    const messagesRef = collection(db, "groups", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        let decryptedText = "Error decrypting message"; // Default error message
        try {
          // Attempt to decrypt the message
          const bytes = CryptoJS.AES.decrypt(data.encryptedText, ENCRYPTION_SECRET_KEY);
          decryptedText = bytes.toString(CryptoJS.enc.Utf8);

          // Optional: Verify integrity using the hash
          const receivedHash = data.hashedText;
          const calculatedHash = CryptoJS.SHA256(decryptedText).toString(CryptoJS.enc.Hex);

          if (receivedHash !== calculatedHash) {
            console.warn("Message integrity compromised! Hash mismatch.");
            decryptedText += " (INTEGRITY WARNING!)"; // Indicate potential tampering
          }

        } catch (e) {
          console.error("Decryption failed:", e);
        }

        return {
          id: doc.id,
          sender: data.sender,
          text: decryptedText, // This is the displayed decrypted message
          hashedText: data.hashedText, // The hash stored in Firestore (of the plaintext)
          encryptedText: data.encryptedText, // The encrypted text stored in Firestore
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId, isMember]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !isMember) return;

    // Hash the original plaintext message (for integrity check later)
    const hashedMessage = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);

    // Encrypt the original plaintext message
    const encryptedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_SECRET_KEY).toString();

    const messagesRef = collection(db, "groups", groupId, "messages");
    await addDoc(messagesRef, {
      sender: loggedInUser,
      hashedText: hashedMessage,       // Store the hash of the PLAINTEXT
      encryptedText: encryptedMessage,  // Store the ENCRYPTED TEXT
      timestamp: serverTimestamp(),
    });

    setMessage("");
  };

  // Format timestamp to readable time
  const formatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) { // Use getTime() for robust Date check
      return 'Invalid Date';
    }
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
                      {/* Optional: Display hashed/encrypted for debugging, not for users */}
                      {/* <div className="message-debug">
                        Hash: {msg.hashedText}<br/>
                        Encrypted: {msg.encryptedText.substring(0, 30)}...
                      </div> */}
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