import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import "./FindTeammates.css";

const FindTeammates = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Exclude the logged-in user from the list
        const filteredUsers = userList.filter(user => user.email !== loggedInUserEmail);
        setUsers(filteredUsers);

        // Fetch sent requests
        const requestsCollection = collection(db, "requests");
        const q = query(requestsCollection, where("sender", "==", loggedInUserEmail));
        const requestsSnapshot = await getDocs(q);
        const sentRequestsList = requestsSnapshot.docs.map((doc) => doc.data().receiver);
        setSentRequests(sentRequestsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
        timestamp: new Date(),
      });

      // Update sent requests state
      setSentRequests([...sentRequests, receiverEmail]);
      
      // Show success notification
      const notification = document.createElement("div");
      notification.className = "notification success";
      notification.textContent = "Request sent successfully!";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    } catch (error) {
      console.error("Error sending request:", error);
      
      // Show error notification
      const notification = document.createElement("div");
      notification.className = "notification error";
      notification.textContent = "Failed to send request. Please try again.";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    }
  };

  const filterUsers = () => {
    return users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.skills?.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="find-teammates-container">
      <div className="header-section">
        <h1>Find Your Teammates</h1>
        <p className="subtitle">Connect with talented individuals for your next project</p>
      </div>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by name or skill..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading user profiles...</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            <p>{filterUsers().length} {filterUsers().length === 1 ? 'match' : 'matches'} found</p>
          </div>
          
          <div className="user-list">
            {filterUsers().length > 0 ? (
              filterUsers().map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-card-header">
                    <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</div>
                    <h3>{user.name}</h3>
                    <p className="college">{user.college}</p>
                  </div>
                  
                  <div className="user-card-content">
                    <div className="info-row">
                      <span className="label">Year:</span>
                      <span className="value">{user.currentYear}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Education:</span>
                      <span className="value">{user.education}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Skills:</span>
                      <span className="value skill-tags">
                        {user.skills?.split(',').map((skill, index) => (
                          <span key={index} className="skill-tag">{skill.trim()}</span>
                        ))}
                      </span>
                    </div>
                    
                    <div className="additional-info">
                      <details>
                        <summary>More Information</summary>
                        <div className="info-row">
                          <span className="label">Email:</span>
                          <span className="value">{user.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Projects:</span>
                          <span className="value">{user.projects}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Hackathons:</span>
                          <span className="value">{user.hackathons}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Certifications:</span>
                          <span className="value">{user.certifications}</span>
                        </div>
                      </details>
                    </div>
                  </div>
                  
                  <div className="user-card-footer">
                    <div className="profile-links">
                      {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                          LinkedIn
                        </a>
                      )}
                      {user.github && (
                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                          GitHub
                        </a>
                      )}
                    </div>
                    
                    <button 
                      className={`request-button ${sentRequests.includes(user.email) ? 'sent' : ''}`}
                      onClick={() => sendRequest(user.email)}
                      disabled={sentRequests.includes(user.email)}
                    >
                      {sentRequests.includes(user.email) ? "Request Sent" : "Send Request"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No matching teammates found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FindTeammates;