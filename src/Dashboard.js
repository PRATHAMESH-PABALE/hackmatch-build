import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
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
          <div className="profile-section">
            <img
              src={user.photoURL}
              alt="User Profile"
              className="profile-pic"
              onClick={() => setShowLogout(!showLogout)}
            />
            {showLogout && (
              <div className="logout-box">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
            <h2 className="user-name">Hello, {user.displayName}</h2>
          </div>
        </header>
      )}

      <div className="card-container">
        <div className="card" onClick={() => navigate("/find-teammates")}>
          <img src="/images/find-teammates.png" alt="Find Teammates" />
          <p>Find Your Teammates</p>
        </div>
        <div className="card" onClick={() => navigate("/connections")}>
          <img src="/images/connections.png" alt="Connections" />
          <p>Your Connections</p>
        </div>
        <div className="card" onClick={() => navigate("/groups")}>
          <img src="/images/groups.png" alt="Groups" />
          <p>Your Groups</p>
        </div>
        <div className="card" onClick={() => navigate("/requests")}>
          <img src="/images/requests.png" alt="Requests" />
          <p>Requests</p>
        </div>
        <div className="card" onClick={() => navigate("/profile")}>
          <img src="/images/profile.png" alt="Profile" />
          <p>Profile Section</p>
        </div>
        <div className="card" onClick={() => navigate("/about-us")}>
          <img src="/images/about-us.png" alt="About Us" />
          <p>HackMatch.ai - Hackathon Roadmap</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
