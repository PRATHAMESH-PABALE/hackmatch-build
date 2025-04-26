import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "./Hackathons.css";

const Hackathons = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "all",
    date: "all",
    type: "all",
    skill: "all"
  });
  
  const navigate = useNavigate();

  // Auth state monitoring
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

  // Fetch hackathons data
  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint and key
        const response = await fetch(
          "https://mlh.io/seasons/2025/events", 
          {
            headers: {
              "Authorization": `Bearer ${process.env.REACT_APP_HACKATHON_API_KEY}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setHackathons(data);
      } catch (e) {
        console.error("Error fetching hackathons:", e);
        setError("Failed to load hackathons. Please try again later.");
        
        // Fallback data for development/demo purposes
        setHackathons([
          {
            id: 1,
            name: "TechCrunch Disrupt Hackathon",
            startDate: "2025-05-01",
            endDate: "2025-05-03",
            location: "Online",
            type: "AI & Machine Learning",
            description: "Build innovative AI solutions that disrupt industries",
            url: "https://techcrunch.com/events/disrupt-2025",
            imageUrl: "/images/techcrunch.png",
            registrationDeadline: "2025-04-28",
            prizes: "$30,000 in total prizes",
            skills: ["AI", "Machine Learning", "Cloud Computing"]
          },
          {
            id: 2,
            name: "HackMIT",
            startDate: "2025-05-15",
            endDate: "2025-05-17",
            location: "Cambridge, MA",
            type: "Student",
            description: "MIT's flagship hackathon for students worldwide",
            url: "https://hackmit.org",
            imageUrl: "/images/hackmit.png",
            registrationDeadline: "2025-05-01",
            prizes: "Internship opportunities and hardware prizes",
            skills: ["Web Development", "Mobile", "Hardware"]
          },
          {
            id: 3,
            name: "Google DevFest",
            startDate: "2025-06-05",
            endDate: "2025-06-07",
            location: "Multiple Locations",
            type: "Developer",
            description: "Build innovative solutions using Google technologies",
            url: "https://developers.google.com/events",
            imageUrl: "/images/google-devfest.png",
            registrationDeadline: "2025-05-20",
            prizes: "Google hardware and Google Cloud credits",
            skills: ["Google Cloud", "Android", "Web"]
          },
          {
            id: 4,
            name: "HealthTech Hackathon",
            startDate: "2025-06-12",
            endDate: "2025-06-14",
            location: "Boston, MA",
            type: "Healthcare",
            description: "Revolutionize healthcare with innovative technology solutions",
            url: "https://healthtechhack.org",
            imageUrl: "/images/healthtech.png",
            registrationDeadline: "2025-06-01",
            prizes: "$15,000 and mentorship opportunities",
            skills: ["Healthcare", "Data Science", "Mobile"]
          },
          {
            id: 5,
            name: "Blockchain Summit Hackathon",
            startDate: "2025-07-01",
            endDate: "2025-07-03",
            location: "Online",
            type: "Blockchain",
            description: "Create the next generation of decentralized applications",
            url: "https://blockchainsummit.io",
            imageUrl: "/images/blockchain.png",
            registrationDeadline: "2025-06-15",
            prizes: "Crypto prizes worth $50,000",
            skills: ["Blockchain", "Smart Contracts", "Web3"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // Logout functionality
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  // Toggle logout menu
  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowLogout(!showLogout);
  };

  // Close logout menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showLogout) setShowLogout(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLogout]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to hackathons
  const filteredHackathons = hackathons.filter(hackathon => {
    // Filter by location
    if (filters.location !== "all" && hackathon.location !== filters.location) {
      return false;
    }
    
    // Filter by date
    if (filters.date !== "all") {
      const today = new Date();
      const startDate = new Date(hackathon.startDate);
      const monthFromNow = new Date();
      monthFromNow.setMonth(today.getMonth() + 1);
      
      if (filters.date === "thisMonth") {
        if (startDate > monthFromNow || startDate < today) {
          return false;
        }
      } else if (filters.date === "thisWeek") {
        const weekFromNow = new Date();
        weekFromNow.setDate(today.getDate() + 7);
        if (startDate > weekFromNow || startDate < today) {
          return false;
        }
      } else if (filters.date === "upcoming") {
        if (startDate < today) {
          return false;
        }
      }
    }
    
    // Filter by type
    if (filters.type !== "all" && hackathon.type !== filters.type) {
      return false;
    }
    
    // Filter by skill
    if (filters.skill !== "all" && !hackathon.skills.includes(filters.skill)) {
      return false;
    }
    
    return true;
  });

  // Get unique values for filter dropdowns
  const locations = [...new Set(hackathons.map(h => h.location))];
  const types = [...new Set(hackathons.map(h => h.type))];
  const skills = [...new Set(hackathons.flatMap(h => h.skills))];

  // Format date range for display
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="hackathons-container">
      {user && (
        <header className="dashboard-header">
          <div className="header-logo">
            <h1>HackMatch</h1>
          </div>
          
          <nav className="dashboard-nav">
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/explore">Explore</a></li>
              <li><a href="/hackathons" className="active">Hackathons</a></li>
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

      <div className="hackathons-content">
        <div className="hackathons-header">
          <h1>Upcoming Hackathons</h1>
          <p>Find and register for the best hackathons worldwide</p>
        </div>

        <div className="filters-section">
          <h3>Filter Hackathons</h3>
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select 
                id="location" 
                name="location" 
                value={filters.location} 
                onChange={handleFilterChange}
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date">Date</label>
              <select 
                id="date" 
                name="date" 
                value={filters.date} 
                onChange={handleFilterChange}
              >
                <option value="all">All Dates</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="upcoming">All Upcoming</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="type">Category</label>
              <select 
                id="type" 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
              >
                <option value="all">All Categories</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="skill">Skills</label>
              <select 
                id="skill" 
                name="skill" 
                value={filters.skill} 
                onChange={handleFilterChange}
              >
                <option value="all">All Skills</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading hackathons...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="hackathons-grid">
            {filteredHackathons.length > 0 ? (
              filteredHackathons.map(hackathon => (
                <div key={hackathon.id} className="hackathon-card">
                  <div className="hackathon-image">
                    <img src={hackathon.imageUrl} alt={hackathon.name} />
                  </div>
                  <div className="hackathon-details">
                    <div className="hackathon-date-badge">
                      {formatDateRange(hackathon.startDate, hackathon.endDate)}
                    </div>
                    <h3>{hackathon.name}</h3>
                    <div className="hackathon-location">
                      <svg viewBox="0 0 24 24" className="location-icon">
                        <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                      </svg>
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="hackathon-type">
                      <span className="type-badge">{hackathon.type}</span>
                    </div>
                    <p className="hackathon-description">{hackathon.description}</p>
                    <div className="hackathon-skills">
                      {hackathon.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="hackathon-deadline">
                      <strong>Registration Deadline:</strong> {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                    </div>
                    <div className="hackathon-prizes">
                      <strong>Prizes:</strong> {hackathon.prizes}
                    </div>
                    <a 
                      href={hackathon.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="apply-button"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No hackathons match your filters</h3>
                <p>Try adjusting your filter criteria or check back later for new events</p>
                <button 
                  onClick={() => setFilters({
                    location: "all",
                    date: "all",
                    type: "all",
                    skill: "all"
                  })}
                  className="reset-filters-btn"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
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

export default Hackathons;