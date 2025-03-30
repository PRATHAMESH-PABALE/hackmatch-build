import React, { useState, useEffect } from "react";
import { db, storage, auth } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./ChatPopup.css";

const ChatPopup = ({ groupId, groupName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const messagesRef = collection(db, `groups/${groupId}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !file) return;
    setUploading(true);

    let fileUrl = null;
    let fileType = null;

    if (file) {
      const fileRef = ref(storage, `groupChats/${groupId}/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(`Upload Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
        },
        (error) => {
          console.error("Upload Error:", error);
          setUploading(false);
        },
        async () => {
          fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          fileType = file.type;

          await addDoc(collection(db, `groups/${groupId}/messages`), {
            text: message,
            sender: user.email,
            timestamp: serverTimestamp(),
            fileUrl: fileUrl,
            fileType: fileType,
          });

          setMessage("");
          setFile(null);
          setFilePreview(null);
          setUploading(false);
        }
      );
    } else {
      await addDoc(collection(db, `groups/${groupId}/messages`), {
        text: message,
        sender: user.email,
        timestamp: serverTimestamp(),
        fileUrl: null,
        fileType: null,
      });

      setMessage("");
      setUploading(false);
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        {groupName} - Chat
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === user.email ? "sent" : "received"}`}>
            <strong>{msg.sender === user.email ? "You" : msg.sender}:</strong>
            {msg.fileUrl ? (
              msg.fileType.startsWith("image/") ? (
                <img src={msg.fileUrl} alt="Uploaded file" className="file-preview" />
              ) : (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">📄 View Document</a>
              )
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>
      {filePreview && (
        <div className="file-preview-container">
          <strong>Preview:</strong>
          {file.type.startsWith("image/") ? (
            <img src={filePreview} alt="Preview" className="file-preview" />
          ) : (
            <p>📄 {file.name}</p>
          )}
        </div>
      )}
      <div className="chat-input">
        <label className="file-btn">
          📎
          <input type="file" className="file-input" onChange={handleFileChange} />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage} disabled={uploading}>
          {uploading ? "Uploading..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
