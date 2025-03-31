import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ChatPopup from "./ChatPopup"; // Import ChatPopup

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track selected group
  const loggedInUser = auth.currentUser?.email;

  useEffect(() => {
    const fetchGroups = async () => {
      if (!loggedInUser) return;

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
      }
    };

    fetchGroups();
  }, [loggedInUser]);

  return (
    <div className="groups-container">
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p className="no-groups">You are not part of any groups yet.</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group.id} className="group-item">
              <span className="group-name">{group.name}</span>
              <button onClick={() => setSelectedGroup(group.id)}>Chat</button>
            </div>
          ))}
        </div>
      )}

      {/* ChatPopup Component - Opens when a group is selected */}
      {selectedGroup && <ChatPopup groupId={selectedGroup} onClose={() => setSelectedGroup(null)} />}
    </div>
  );
};

export default Groups;
