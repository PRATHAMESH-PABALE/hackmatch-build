import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import "./FindTeammates.css";

const FindTeammates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    const fetchSentRequests = async () => {
      const q = query(collection(db, "requests"), where("senderEmail", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const sentRequestList = querySnapshot.docs.map((doc) => doc.data().receiverEmail);
      setSentRequests(sentRequestList);
    };

    fetchUsers();
    fetchSentRequests();
  }, []);

  const sendRequest = async (receiver) => {
    if (sentRequests.includes(receiver.email) || receiver.email === auth.currentUser.email) {
      return; // Prevent duplicate or self requests
    }

    try {
      await addDoc(collection(db, "requests"), {
        senderName: auth.currentUser.displayName,
        senderEmail: auth.currentUser.email,
        receiverName: receiver.name,
        receiverEmail: receiver.email,
        status: "Pending",
      });

      setSentRequests([...sentRequests, receiver.email]); // Update UI instantly
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="find-teammates-container">
      <h2>Find Your Teammates</h2>
      <input
        type="text"
        placeholder="Search by name or skill..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="user-list">
        {users
          .filter(
            (user) =>
              (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.skills.toLowerCase().includes(searchTerm.toLowerCase())) &&
              user.email !== auth.currentUser.email
          )
          .map((user) => (
            <div key={user.id} className="user-card" onClick={() => setSelectedUser(user)}>
              <h3>{user.name}</h3>
              <p>
                <strong>Skills:</strong> {user.skills}
              </p>
            </div>
          ))}
      </div>

      {selectedUser && (
        <div className="user-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedUser(null)}>
              &times;
            </span>
            <h2>{selectedUser.name}</h2>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Skills:</strong> {selectedUser.skills}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer">
                {selectedUser.linkedin}
              </a>
            </p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a href={selectedUser.github} target="_blank" rel="noopener noreferrer">
                {selectedUser.github}
              </a>
            </p>
            <p>
              <strong>Projects Worked On:</strong> {selectedUser.projects}
            </p>
            <p>
              <strong>Previous Hackathons:</strong> {selectedUser.hackathons}
            </p>
            <p>
              <strong>Certifications:</strong> {selectedUser.certifications}
            </p>
            <p>
              <strong>Hackathon Winner:</strong> {selectedUser.hackathonWinner}
            </p>
            <button
              className="send-request-btn"
              onClick={() => sendRequest(selectedUser)}
              disabled={sentRequests.includes(selectedUser.email)}
            >
              {sentRequests.includes(selectedUser.email) ? "Request Sent" : "Send Request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTeammates;
