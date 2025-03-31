import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import "./Connections.css";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchConnections = async () => {
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

  const handleCreateTeam = async () => {
    if (!teamName || selectedMembers.length === 0) {
      alert("Please enter a team name and select at least one member.");
      return;
    }

    try {
      await addDoc(collection(db, "groups"), {
        name: teamName,
        members: [...selectedMembers, loggedInUserEmail],
      });

      setTeamName("");
      setSelectedMembers([]);
      alert("Team created successfully!");
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="connections-container">
      <h2>Your Connections</h2>
      {connections.length === 0 ? (
        <p>No connections found</p>
      ) : (
        <div className="connections-list">
          {connections.map((connection) => {
            const otherUser =
              connection.user1 === loggedInUserEmail
                ? connection.user2
                : connection.user1;
            return (
              <div key={connection.id} className="connection-card">
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(otherUser)}
                    checked={selectedMembers.includes(otherUser)}
                  />
                  {otherUser}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <div className="team-creation">
        <input
          type="text"
          placeholder="Enter Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>
    </div>
  );
};

export default Connections;
