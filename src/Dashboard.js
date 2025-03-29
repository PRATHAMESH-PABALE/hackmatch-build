import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/"); // Redirect to home if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="dashboard-container">
      {user && (
        <header className="dashboard-header">
          <img
            src={user.photoURL}
            alt="User Profile"
            className="profile-pic"
            onClick={handleLogout}
          />
          <h2>Hello, {user.displayName}</h2>
        </header>
      )}

      <div className="dashboard-cards">
        <div className="card" onClick={() => navigate("/find-teammates")}>
          Find Your Teammates
        </div>
        <div className="card" onClick={() => navigate("/connections")}>
          Your Connections
        </div>
        <div className="card" onClick={() => navigate("/groups")}>
          Your Groups
        </div>
        <div className="card" onClick={() => navigate("/requests")}>
          Requests
        </div>
        <div className="card" onClick={() => navigate("/profile")}>
          Profile Section
        </div>
        <div className="card" onClick={() => navigate("/about-us")}>
          HackMatch.ai - Hackathon Roadmap 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
