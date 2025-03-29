import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, doc, updateDoc, query, where, setDoc } from "firebase/firestore";
import "./Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "requests"), where("receiverEmail", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        const requestList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestList);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (request) => {
    try {
      // Update request status to "Accepted"
      const requestRef = doc(db, "requests", request.id);
      await updateDoc(requestRef, { status: "Accepted" });

      // Add both users as connections
      const senderRef = doc(db, "connections", request.senderEmail);
      const receiverRef = doc(db, "connections", request.receiverEmail);

      await setDoc(senderRef, { connections: { [request.receiverEmail]: true } }, { merge: true });
      await setDoc(receiverRef, { connections: { [request.senderEmail]: true } }, { merge: true });

      // Update state
      setRequests(requests.map((req) => (req.id === request.id ? { ...req, status: "Accepted" } : req)));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="requests">
      <h2>Friend Requests</h2>
      {requests.length > 0 ? (
        requests.map((req) => (
          <div key={req.id} className="request-card">
            <h3>{req.senderName}</h3>
            <p>Email: {req.senderEmail}</p>
            <p>Status: {req.status}</p>
            {req.status === "Pending" && (
              <button onClick={() => handleAcceptRequest(req)}>Accept</button>
            )}
          </div>
        ))
      ) : (
        <p>No requests available.</p>
      )}
    </div>
  );
};

export default Requests;
