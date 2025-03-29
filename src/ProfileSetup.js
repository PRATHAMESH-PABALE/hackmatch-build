import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; // Ensure firebase is correctly imported
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./ProfileSetup.css";

const ProfileSetup = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: "",
    linkedin: "",
    github: "",
    projects: "",
    hackathons: "",
    certifications: "",
    hackathonWinner: "",
  });

  useEffect(() => {
    // Fetch logged-in user data from Firebase Authentication
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setProfile((prev) => ({
        ...prev,
        name: currentUser.displayName || "",
        email: currentUser.email || "",
      }));
      fetchProfileData(currentUser.email);
    }
  }, []);

  const fetchProfileData = async (email) => {
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data());
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.email), profile);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Try again.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Setup</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={profile.email} disabled />

        <label>Name:</label>
        <input type="text" value={profile.name} disabled />

        <label>Skills:</label>
        <input type="text" name="skills" value={profile.skills} onChange={handleChange} required />

        <label>LinkedIn URL:</label>
        <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} required />

        <label>GitHub URL:</label>
        <input type="text" name="github" value={profile.github} onChange={handleChange} required />

        <label>Projects Worked On:</label>
        <textarea name="projects" value={profile.projects} onChange={handleChange} />

        <label>Previous Hackathons:</label>
        <textarea name="hackathons" value={profile.hackathons} onChange={handleChange} />

        <label>Certifications:</label>
        <textarea name="certifications" value={profile.certifications} onChange={handleChange} />

        <label>Any Previous Hackathon Winner?</label>
        <textarea name="hackathonWinner" value={profile.hackathonWinner} onChange={handleChange} />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
