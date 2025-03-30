import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, query } from "firebase/firestore";
import ChatPopup from "./ChatPopup";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [openChatGroup, setOpenChatGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const q = query(collection(db, "groups"));
        const querySnapshot = await getDocs(q);
        const fetchedGroups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div>
      <h2>Your Groups</h2>

      {groups.length === 0 ? (
        <p>No groups created yet</p>
      ) : (
        groups.map((group) => (
          <div key={group.id} className="group-card">
            <h3>{group.groupName}</h3>
            <p>Members:</p>
            <ul>
              {group.members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
            <button onClick={() => setOpenChatGroup(group)}>Chat</button>
          </div>
        ))
      )}

      {openChatGroup && (
        <ChatPopup
          groupId={openChatGroup.id}
          groupName={openChatGroup.groupName}
          onClose={() => setOpenChatGroup(null)}
        />
      )}
    </div>
  );
};

export default Groups;
