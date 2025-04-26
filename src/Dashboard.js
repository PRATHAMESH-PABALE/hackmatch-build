import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
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

  // Close logout menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showLogout) setShowLogout(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLogout]);

  const handleProfileClick = (e) => {
    e.stopPropagation(); // Prevent the outside click handler
    setShowLogout(!showLogout);
  };

  const dashboardCards = [
    { 
      path: "/find-teammates", 
      img: "/images/find-teammates.png", 
      text: "Find Your Teammates",
      description: "Search for developers that match your skills and interests"
    },
    { 
      path: "/connections", 
      img: "/images/connections.png", 
      text: "Your Connections",
      description: "Manage your network of hackathon teammates"
    },
    { 
      path: "/groups", 
      img: "/images/groups.png", 
      text: "Your Groups",
      description: "Access your hackathon teams and projects"
    },
    { 
      path: "/requests", 
      img: "/images/requests.png", 
      text: "Requests",
      description: "View and manage your pending team requests"
    },
    { 
      path: "/profile", 
      img: "/images/profile.png", 
      text: "Profile Section",
      description: "Update your skills, bio, and preferences"
    },
    { 
      path: "/about-us", 
      img: "/images/about-us.png", 
      text: "Hackathon Roadmap",
      description: "Find upcoming hackathons and resources"
    },
  ];

  return (
    <div className="dashboard-container">
      {user && (
        <header className="dashboard-header">
          <div className="header-logo">
            <h1>HackMatch</h1>
          </div>
          
          <nav className="dashboard-nav">
            <ul>
              <li><a href="/dashboard" className="active">Dashboard</a></li>
              <Link to="/explore">Explore</Link>
              <Link to="/hackathons">Explore</Link>
              <li><a href="/resources">Resources</a></li>
            </ul>
          </nav>

          <div className="profile-section">
            <div className="user-info">
              <span className="welcome-text">Welcome,</span>
              <h2 className="user-name">{user.displayName}</h2>
            </div>
            <div className="profile-pic-container">
              <img
                src={user.photoURL}
                alt="User Profile"
                className="profile-pic"
                onClick={handleProfileClick}
              />
              {showLogout && (
                <div className="logout-box" onClick={(e) => e.stopPropagation()}>
                  <div className="user-email">{user.email}</div>
                  <button onClick={handleLogout} className="logout-btn">
                    <svg viewBox="0 0 24 24" className="logout-icon">
                      <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Your HackMatch Dashboard</h2>
          <p>Connect with teammates, manage your groups, and find your next hackathon project</p>
        </div>

        <div className="card-container">
          {dashboardCards.map((item, index) => (
            <div key={index} className="card" onClick={() => navigate(item.path)}>
              <div className="card-icon">
                <img src={item.img} alt={item.text} />
              </div>
              <div className="card-content">
                <h3>{item.text}</h3>
                <p>{item.description}</p>
              </div>
              <div className="card-arrow">
                <svg viewBox="0 0 24 24">
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        <div className="upcoming-hackathons">
          <h2>Upcoming Hackathons</h2>
          <div className="hackathon-scroll">
            <div className="hackathon-card">
              <div className="hackathon-date">May 1-3</div>
              <h3>TechCrunch Disrupt</h3>
              <p>Global online hackathon focused on AI solutions</p>
              <button>Learn More</button>
            </div>
            <div className="hackathon-card">
              <div className="hackathon-date">May 15-17</div>
              <h3>HackMIT</h3>
              <p>MIT's flagship hackathon for students worldwide</p>
              <button>Learn More</button>
            </div>
            <div className="hackathon-card">
              <div className="hackathon-date">June 5-7</div>
              <h3>Google DevFest</h3>
              <p>Build innovative solutions using Google technologies</p>
              <button>Learn More</button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} HackMatch. All rights reserved.</p>
        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/help">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;