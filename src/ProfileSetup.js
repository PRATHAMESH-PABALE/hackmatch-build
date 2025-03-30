import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

  // Fetch existing user data from Firestore
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

  // URL Validation Function
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

    // Validate LinkedIn & GitHub URLs
    const linkedinError = validateURL(linkedin, "linkedin");
    const githubError = validateURL(github, "github");

    if (linkedinError || githubError) {
      setError(linkedinError || githubError);
      return;
    }

    // Ensure all fields are filled
    if (!name || !college || !education || !currentYear || !skills || !projects || !hackathons || !certifications) {
      setError("All fields are required!");
      return;
    }

    try {
      const userRef = doc(db, "users", email);
      await setDoc(userRef, { 
        name, 
        email, 
        college, 
        education, 
        currentYear, 
        linkedin, 
        github, 
        skills, 
        projects, 
        hackathons, 
        certifications 
      });

      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Try again.");
    }
  };

  return (
    <div>
      <h2>Profile Setup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" value={email} disabled />
        <input type="text" placeholder="College Name" value={college} onChange={(e) => setCollege(e.target.value)} required />
        <input type="text" placeholder="Education" value={education} onChange={(e) => setEducation(e.target.value)} required />
        <input type="text" placeholder="Current Year of Study" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} required />
        <input type="text" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} required />
        <input type="text" placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} required />
        <input type="text" placeholder="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} required />
        <textarea placeholder="Projects Worked On" value={projects} onChange={(e) => setProjects(e.target.value)} required />
        <textarea placeholder="Previous Hackathons" value={hackathons} onChange={(e) => setHackathons(e.target.value)} required />
        <textarea placeholder="Certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} required />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
