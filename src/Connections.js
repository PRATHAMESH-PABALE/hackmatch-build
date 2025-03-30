import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connectionsCollection = collection(db, "connections");
        const q = query(
          connectionsCollection,
          where("user1", "==", loggedInUserEmail) // Fetch connections where the logged-in user is user1
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

  return (
    <div>
      <h2>Your Connections</h2>
      {connections.length === 0 ? (
        <p>No connections found</p>
      ) : (
        <div>
          {connections.map((connection) => (
            <div key={connection.id} className="connection-card">
              <p>
                <strong>Connected with:</strong>{" "}
                {connection.user1 === loggedInUserEmail
                  ? connection.user2
                  : connection.user1}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
