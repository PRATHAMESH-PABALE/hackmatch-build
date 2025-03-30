import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs, updateDoc, doc, addDoc, query, where } from "firebase/firestore";

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
    <div>
      <h2>Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div>
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <p><strong>From:</strong> {request.sender}</p>
              {request.status === "accepted" ? (
                <p className="accepted">✅ Accepted</p>
              ) : (
                <>
                  <button onClick={() => handleAccept(request.id, request.sender)}>Accept</button>
                  <button onClick={() => handleDecline(request.id)}>Decline</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
