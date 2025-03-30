import React, { useState, useEffect } from "react";
import { db, auth, storage } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const ChatPopup = ({ groupId, groupName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, "groupMessages"),
        where("groupId", "==", groupId),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe();
    };

    fetchMessages();
  }, [groupId]);

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let fileUrl = null;

      if (selectedFile) {
        const fileRef = ref(storage, `groupChats/${groupId}/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, selectedFile);

        await uploadTask;
        fileUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "groupMessages"), {
        groupId,
        sender: loggedInUserEmail,
        text: newMessage,
        fileUrl,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3>{groupName} - Chat</h3>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender === loggedInUserEmail ? "sent" : "received"}>
            <p><strong>{msg.sender}</strong></p>
            {msg.text && <p>{msg.text}</p>}
            {msg.fileUrl && (
              <p>
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">View Attachment</a>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPopup;
