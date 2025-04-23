import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ChatPopup from "./ChatPopup"; // Import ChatPopup
import "./Groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = auth.currentUser?.email;

  useEffect(() => {
    const fetchGroups = async () => {
      if (!loggedInUser) return;
      
      setIsLoading(true);
      try {
        const groupsCollection = collection(db, "groups");
        const q = query(groupsCollection, where("members", "array-contains", loggedInUser));
        const snapshot = await getDocs(q);

        const userGroups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroups(userGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [loggedInUser]);

  const openChat = (groupId) => {
    setSelectedGroup(groupId);
  };

  const closeChat = () => {
    setSelectedGroup(null);
  };

  // Get members count for each group
  const getMembersCount = (group) => {
    return group.members ? group.members.length : 0;
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h2>Your Groups</h2>
        <p className="groups-subtitle">Connect and collaborate with your teams</p>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your groups...</p>
        </div>
      ) : (
        <>
          {groups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Groups Found</h3>
              <p className="empty-description">
                You are not part of any groups yet. Join or create a group to collaborate with others.
              </p>
            </div>
          ) : (
            <div className="groups-list">
              {groups.map((group) => (
                <div key={group.id} className="group-card">
                  <div className="group-info">
                    <div className="group-avatar">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="group-details">
                      <h3 className="group-name">{group.name}</h3>
                      <span className="members-count">
                        {getMembersCount(group)} {getMembersCount(group) === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </div>
                  <div className="group-actions">
                    <button 
                      className="chat-button"
                      onClick={() => openChat(group.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ChatPopup Component - Opens when a group is selected */}
      {selectedGroup && <ChatPopup groupId={selectedGroup} onClose={closeChat} />}
    </div>
  );
};

export default Groups;