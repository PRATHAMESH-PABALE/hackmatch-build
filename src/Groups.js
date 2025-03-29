import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import "./Groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const q = query(collection(db, "groups"));
        onSnapshot(q, (snapshot) => {
          const groupList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(), // Ensure all data is retrieved properly
          }));
          setGroups(groupList);
        });
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const openChat = (group) => {
    setSelectedGroup(group);
    const q = query(collection(db, "groups", group.id, "messages"));
    onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      setChatMessages(messages);
    });
  };

  const sendMessage = async () => {
    if (message.trim() !== "" && selectedGroup) {
      try {
        await addDoc(collection(db, "groups", selectedGroup.id, "messages"), {
          text: message,
          sender: auth.currentUser.email,
          timestamp: new Date(),
        });
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="groups">
      <h2>Your Groups</h2>

      <div className="group-list">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className="group-card">
              <h3>{group.name ? group.name : "No Name Available"}</h3>
              <button onClick={() => openChat(group)}>Chat</button>
            </div>
          ))
        ) : (
          <p>No groups created yet.</p>
        )}
      </div>

      {selectedGroup && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>{selectedGroup.name} - Chat</h3>
            <button onClick={() => setSelectedGroup(null)}>Close</button>
          </div>
          <div className="chat-body">
            {chatMessages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender}: </strong> {msg.text}
              </p>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
