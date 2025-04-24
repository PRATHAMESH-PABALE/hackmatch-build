import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./ProfileSetup.css";

const Profile = () => {
  const [name, setName] = useState("");
  const email = auth.currentUser?.email || "";
  const [college, setCollege] = useState("");
  const [education, setEducation] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [hackathons, setHackathons] = useState("");
  const [certifications, setCertifications] = useState("");
  const [error, setError] = useState("");

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;

      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "");
        setCollege(data.college || "");
        setEducation(data.education || "");
        setCurrentYear(data.currentYear || "");
        setLinkedin(data.linkedin || "");
        setGithub(data.github || "");
        setSkills(data.skills || "");
        setProjects(data.projects || "");
        setHackathons(data.hackathons || "");
        setCertifications(data.certifications || "");
      }
    };

    fetchProfile();
  }, [email]);

  // Validate LinkedIn & GitHub URLs
  const validateURL = (url, type) => {
    const linkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/.*$/;
    const githubPattern = /^https:\/\/(www\.)?github\.com\/.*$/;

    if (type === "linkedin" && !linkedinPattern.test(url)) {
      return "Enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username)";
    }
    if (type === "github" && !githubPattern.test(url)) {
      return "Enter a valid GitHub URL (e.g., https://github.com/username)";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const linkedinError = validateURL(linkedin, "linkedin");
    const githubError = validateURL(github, "github");

    if (linkedinError || githubError) {
      setError(linkedinError || githubError);
      return;
    }

    if (!name || !college || !education || !currentYear || !skills || !projects || !hackathons || !certifications) {
      setError("All fields are required!");
      return;
    }

    try {
      const userRef = doc(db, "users", email);
      await setDoc(userRef, { 
        name, email, college, education, currentYear, linkedin, github, skills, projects, hackathons, certifications 
      });

      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Try again.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Setup</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            placeholder="Enter your full name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            value={email} 
            disabled 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="college">College Name</label>
          <input 
            type="text" 
            id="college"
            placeholder="Enter your college name" 
            value={college} 
            onChange={(e) => setCollege(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="education">Education</label>
          <input 
            type="text" 
            id="education"
            placeholder="Degree, specialization" 
            value={education} 
            onChange={(e) => setEducation(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="currentYear">Current Year of Study</label>
          <input 
            type="text" 
            id="currentYear"
            placeholder="e.g., 2nd year, Final year" 
            value={currentYear} 
            onChange={(e) => setCurrentYear(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input 
            type="text" 
            id="linkedin"
            placeholder="https://www.linkedin.com/in/username" 
            value={linkedin} 
            onChange={(e) => setLinkedin(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="github">GitHub Profile</label>
          <input 
            type="text" 
            id="github"
            placeholder="https://github.com/username" 
            value={github} 
            onChange={(e) => setGithub(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input 
            type="text" 
            id="skills"
            placeholder="Python, React, Machine Learning, etc." 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="projects">Projects</label>
          <textarea 
            id="projects"
            placeholder="Describe your key projects" 
            value={projects} 
            onChange={(e) => setProjects(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hackathons">Hackathons</label>
          <textarea 
            id="hackathons"
            placeholder="List the hackathons you've participated in" 
            value={hackathons} 
            onChange={(e) => setHackathons(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="certifications">Certifications</label>
          <textarea 
            id="certifications"
            placeholder="List your relevant certifications" 
            value={certifications} 
            onChange={(e) => setCertifications(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;