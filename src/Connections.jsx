import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import "./Connections.css";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        const connectionsCollection = collection(db, "connections");
        const q = query(
          connectionsCollection,
          where("user1", "==", loggedInUserEmail)
        );

        const connectionsSnapshot = await getDocs(q);
        const connectionsList = connectionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConnections(connectionsList);
      } catch (error) {
        console.error("Error fetching connections:", error);
        showNotification("Failed to load connections. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [loggedInUserEmail]);

  const handleCheckboxChange = (email) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers(selectedMembers.filter((member) => member !== email));
    } else {
      setSelectedMembers([...selectedMembers, email]);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      showNotification("Please enter a team name.", "error");
      return;
    }

    if (selectedMembers.length === 0) {
      showNotification("Please select at least one team member.", "error");
      return;
    }

    try {
      await addDoc(collection(db, "groups"), {
        name: teamName,
        members: [...selectedMembers, loggedInUserEmail],
        createdAt: new Date(),
        createdBy: loggedInUserEmail
      });

      setTeamName("");
      setSelectedMembers([]);
      showNotification("Team created successfully!", "success");
    } catch (error) {
      console.error("Error creating team:", error);
      showNotification("Failed to create team. Please try again.", "error");
    }
  };

  return (
    <div className="connections-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="connections-header">
        <h2>Your Connections</h2>
        <p className="connections-subtitle">Select members to create a team</p>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your connections...</p>
        </div>
      ) : (
        <>
          {connections.length === 0 ? (
            <div className="no-connections">
              <div className="empty-state-icon">👥</div>
              <p>You don't have any connections yet.</p>
              <p className="sub-message">Connect with other users to start creating teams!</p>
            </div>
          ) : (
            <div className="connections-content">
              <div className="selected-count">
                <span>{selectedMembers.length} members selected</span>
              </div>
              
              <div className="connections-list">
                {connections.map((connection) => {
                  const otherUser =
                    connection.user1 === loggedInUserEmail
                      ? connection.user2
                      : connection.user1;
                  return (
                    <div key={connection.id} className="connection-card">
                      <div className="connection-avatar">
                        {otherUser.charAt(0).toUpperCase()}
                      </div>
                      <div className="connection-details">
                        <span className="connection-email">{otherUser}</span>
                        <span className="connection-status">Connected</span>
                      </div>
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(otherUser)}
                          checked={selectedMembers.includes(otherUser)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="team-creation">
            <div className="team-creation-header">
              <h3>Create a New Team</h3>
              <p>Enter a name and select members to create your team</p>
            </div>
            
            <div className="team-creation-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="team-name-input"
                />
              </div>
              
              <button 
                onClick={handleCreateTeam}
                className="create-team-button"
                disabled={!teamName.trim() || selectedMembers.length === 0}
              >
                Create Team
              </button>
            </div>
            
            {selectedMembers.length > 0 && (
              <div className="selected-members">
                <h4>Selected Members:</h4>
                <div className="member-tags">
                  {selectedMembers.map((member) => (
                    <div key={member} className="member-tag">
                      <span>{member}</span>
                      <button 
                        onClick={() => handleCheckboxChange(member)}
                        className="remove-member"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Connections;