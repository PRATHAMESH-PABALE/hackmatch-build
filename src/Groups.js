import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import ChatPopup from "./ChatPopup";
import "./Groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "groups"));
      const groupList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupList);
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-container">
      <h2>Your Groups</h2>
      {groups.map((group) => (
        <div key={group.id} className="group-card">
          <h3>{group.groupName}</h3>
          <button onClick={() => setSelectedGroup(group)}>Chat</button>
        </div>
      ))}

      {selectedGroup && (
        <ChatPopup
          groupId={selectedGroup.id}
          groupName={selectedGroup.groupName}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default Groups;
