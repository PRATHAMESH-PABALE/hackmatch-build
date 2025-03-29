import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore"; // Removed setDoc
import "./Connections.css";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const userRef = doc(db, "connections", auth.currentUser.email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setConnections(Object.keys(userDoc.data().connections || {}));
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, []);

  const handleGroupCreation = async () => {
    if (!groupName || selectedMembers.length === 0) {
      alert("Enter a group name and select at least one member.");
      return;
    }

    try {
      await addDoc(collection(db, "groups"), {
        groupName,
        members: [...selectedMembers, auth.currentUser.email], // Include the creator
      });

      alert("Group created successfully!");
      setGroupName("");
      setSelectedMembers([]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="connections">
      <h2>Your Connections</h2>
      {connections.length > 0 ? (
        <>
          {connections.map((email, index) => (
            <p key={index}>{email}</p>
          ))}

          <h3>Create a Group</h3>
          <input
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div>
            {connections.map((email) => (
              <label key={email}>
                <input
                  type="checkbox"
                  value={email}
                  checked={selectedMembers.includes(email)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMembers([...selectedMembers, email]);
                    } else {
                      setSelectedMembers(selectedMembers.filter((m) => m !== email));
                    }
                  }}
                />
                {email}
              </label>
            ))}
          </div>
          <button onClick={handleGroupCreation}>Create Group</button>
        </>
      ) : (
        <p>No connections yet.</p>
      )}
    </div>
  );
};

export default Connections;
