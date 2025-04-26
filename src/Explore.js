import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./Explore.css";

const Explore = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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

  // Sample project data
  const projectsData = [
    {
      id: 1,
      title: "AI Code Assistant",
      description: "An intelligent code assistant that helps developers write better code faster",
      tags: ["ai", "developer-tools", "productivity"],
      members: 4,
      difficulty: "Advanced",
      image: "/images/ai-code.png"
    },
    {
      id: 2,
      title: "Health Tracker App",
      description: "Mobile application for tracking fitness and nutrition goals",
      tags: ["mobile", "health", "react-native"],
      members: 3,
      difficulty: "Intermediate",
      image: "/images/health-app.png"
    },
    {
      id: 3,
      title: "Community Marketplace",
      description: "A platform for local communities to buy, sell, and exchange goods",
      tags: ["web", "e-commerce", "community"],
      members: 5,
      difficulty: "Intermediate",
      image: "/images/marketplace.png"
    },
    {
      id: 4,
      title: "Smart Home Dashboard",
      description: "Central control system for IoT devices and smart home automation",
      tags: ["iot", "web", "smart-home"],
      members: 3,
      difficulty: "Advanced",
      image: "/images/smart-home.png"
    },
    {
      id: 5,
      title: "Educational Game Platform",
      description: "Interactive games that help children learn programming concepts",
      tags: ["education", "games", "web"],
      members: 4,
      difficulty: "Intermediate",
      image: "/images/edu-game.png"
    },
    {
      id: 6,
      title: "Virtual Reality Tour Guide",
      description: "VR application that provides guided tours of historical landmarks",
      tags: ["vr", "tourism", "unity"],
      members: 6,
      difficulty: "Advanced",
      image: "/images/vr-tour.png"
    }
  ];

  // Filter projects based on active filter and search term
  const filteredProjects = projectsData.filter(project => {
    const matchesFilter = activeFilter === "all" || project.tags.includes(activeFilter);
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="explore-container">
      {user && (
        <header className="dashboard-header">
          <div className="header-logo">
            <h1>HackMatch</h1>
          </div>
          
          <nav className="dashboard-nav">
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/explore" className="active">Explore</a></li>
              <li><a href="/hackathons">Hackathons</a></li>
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

      <div className="explore-content">
        <div className="explore-header">
          <h2>Explore Projects</h2>
          <p>Discover innovative projects and find inspiration for your next hackathon</p>
        </div>

        <div className="explore-tools">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <svg viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
            </button>
          </div>

          <div className="filter-tabs">
            <button 
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button 
              className={activeFilter === "web" ? "active" : ""}
              onClick={() => setActiveFilter("web")}
            >
              Web
            </button>
            <button 
              className={activeFilter === "mobile" ? "active" : ""}
              onClick={() => setActiveFilter("mobile")}
            >
              Mobile
            </button>
            <button 
              className={activeFilter === "ai" ? "active" : ""}
              onClick={() => setActiveFilter("ai")}
            >
              AI/ML
            </button>
            <button 
              className={activeFilter === "iot" ? "active" : ""}
              onClick={() => setActiveFilter("iot")}
            >
              IoT
            </button>
            <button 
              className={activeFilter === "games" ? "active" : ""}
              onClick={() => setActiveFilter("games")}
            >
              Games
            </button>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-details">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span className="team-size">
                      <svg viewBox="0 0 24 24">
                        <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                      </svg>
                      {project.members} Members
                    </span>
                    <span className="difficulty">
                      <svg viewBox="0 0 24 24">
                        <path d="M19,3H14V5H19V18H5V5H10V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z" />
                      </svg>
                      {project.difficulty}
                    </span>
                  </div>
                  <div className="project-tags">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <button className="details-btn">View Details</button>
                    <button className="join-btn">Join Project</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <svg viewBox="0 0 24 24">
                <path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" />
              </svg>
              <p>No projects match your search criteria</p>
              <button onClick={() => {setActiveFilter("all"); setSearchTerm("");}}>
                Reset Filters
              </button>
            </div>
          )}
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

export default Explore;