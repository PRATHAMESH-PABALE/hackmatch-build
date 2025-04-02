import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import "./FindTeammates.css";

const FindTeammates = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Exclude the logged-in user from the list
        const filteredUsers = userList.filter(user => user.email !== loggedInUserEmail);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchSentRequests = async () => {
      try {
        const requestsCollection = collection(db, "requests");
        const q = query(requestsCollection, where("sender", "==", loggedInUserEmail));
        const requestsSnapshot = await getDocs(q);
        const sentRequestsList = requestsSnapshot.docs.map((doc) => doc.data().receiver);
        setSentRequests(sentRequestsList);
      } catch (error) {
        console.error("Error fetching sent requests:", error);
      }
    };

    fetchUsers();
    fetchSentRequests();
  }, [loggedInUserEmail]);

  const sendRequest = async (receiverEmail) => {
    if (sentRequests.includes(receiverEmail)) {
      alert("Request already sent to this user!");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        sender: loggedInUserEmail,
        receiver: receiverEmail,
        status: "pending",
      });

      // Update sent requests state
      setSentRequests([...sentRequests, receiverEmail]);
      alert("Request sent successfully!");
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
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />

      <div className="user-list">
        {users
          .filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.skills.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>College:</strong> {user.college}</p>
              <p><strong>Education:</strong> {user.education}</p>
              <p><strong>Current Year:</strong> {user.currentYear}</p>
              <p><strong>Skills:</strong> {user.skills}</p>
              <p><strong>Projects:</strong> {user.projects}</p>
              <p><strong>Hackathons:</strong> {user.hackathons}</p>
              <p><strong>Certifications:</strong> {user.certifications}</p>
              <p><strong>LinkedIn:</strong> <a href={user.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></p>
              <p><strong>GitHub:</strong> <a href={user.github} target="_blank" rel="noopener noreferrer">View Profile</a></p>
              
              <button 
                onClick={() => sendRequest(user.email)}
                disabled={sentRequests.includes(user.email)}
              >
                {sentRequests.includes(user.email) ? "Request Sent" : "Send Request"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FindTeammates;
