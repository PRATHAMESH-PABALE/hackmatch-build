import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, updateDoc, doc, addDoc, query, where } from "firebase/firestore";
import "./Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const loggedInUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollection = collection(db, "requests");
        const q = query(requestsCollection, where("receiver", "==", loggedInUserEmail));
        const requestsSnapshot = await getDocs(q);
        const requestsList = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [loggedInUserEmail]);

  const handleAccept = async (requestId, senderEmail) => {
    try {
      // Update request status to "accepted"
      const requestRef = doc(db, "requests", requestId);
      await updateDoc(requestRef, { status: "accepted" });

      // Add both users to the "connections" collection
      await addDoc(collection(db, "connections"), {
        user1: loggedInUserEmail,
        user2: senderEmail,
      });

      // Update UI to reflect accepted status
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "accepted" } : req
        )
      );

      alert("Request accepted! You are now connected.");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      // Remove the request from Firebase
      const requestRef = doc(db, "requests", requestId);
      await updateDoc(requestRef, { status: "declined" });

      // Update UI to remove declined request
      setRequests(requests.filter(request => request.id !== requestId));

      alert("Request declined.");
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  return (
    <div className="requests-container">
      <h2>Connection Requests</h2>
      {requests.length === 0 ? (
        <p className="no-requests">No pending requests</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-details">
                <p><strong>From:</strong> {request.sender}</p>
              </div>
              <div className="request-actions">
                {request.status === "accepted" ? (
                  <p className="accepted">✅ Connected</p>
                ) : (
                  <>
                    <button className="accept-btn" onClick={() => handleAccept(request.id, request.sender)}>Accept</button>
                    <button className="reject-btn" onClick={() => handleDecline(request.id)}>Decline</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;