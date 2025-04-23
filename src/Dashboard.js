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
        {[
          { path: "/find-teammates", img: "/images/find-teammates.png", text: "Find Your Teammates" },
          { path: "/connections", img: "/images/connections.png", text: "Your Connections" },
          { path: "/groups", img: "/images/groups.png", text: "Your Groups" },
          { path: "/requests", img: "/images/requests.png", text: "Requests" },
          { path: "/profile", img: "/images/profile.png", text: "Profile Section" },
          { path: "/about-us", img: "/images/about-us.png", text: "HackMatch.ai - Hackathon Roadmap" },
        ].map((item, index) => (
          <div key={index} className="card" onClick={() => navigate(item.path)}>
            <img src={item.img} alt={item.text} />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
