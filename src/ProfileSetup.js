import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./ProfileSetup.css";

const Profile = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    linkedIn: "",
    gitHub: "",
    skills: "",
    college: "",
    education: "",
    yearOfStudy: "First Year",
    projects: "",
    hackathons: "",
    certifications: "",
    hackathonWinner: "",
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "profiles", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, "profiles", user.email), profile);
    alert("Profile saved successfully!");
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <input type="text" name="name" value={profile.name} placeholder="Full Name" onChange={handleChange} disabled />
      <input type="email" name="email" value={profile.email} placeholder="Email" onChange={handleChange} disabled />
      <input type="text" name="linkedIn" value={profile.linkedIn} placeholder="LinkedIn URL" onChange={handleChange} />
      <input type="text" name="gitHub" value={profile.gitHub} placeholder="GitHub URL" onChange={handleChange} />
      <input type="text" name="skills" value={profile.skills} placeholder="Skills (e.g. React, Firebase)" onChange={handleChange} />
      <input type="text" name="college" value={profile.college} placeholder="College Name" onChange={handleChange} />
      <input type="text" name="education" value={profile.education} placeholder="Education (e.g. B.Tech in CS)" onChange={handleChange} />
      <select name="yearOfStudy" value={profile.yearOfStudy} onChange={handleChange}>
        <option>First Year</option>
        <option>Second Year</option>
        <option>Third Year</option>
        <option>Final Year</option>
      </select>
      <input type="text" name="projects" value={profile.projects} placeholder="Projects Worked On" onChange={handleChange} />
      <input type="text" name="hackathons" value={profile.hackathons} placeholder="Previous Hackathons" onChange={handleChange} />
      <input type="text" name="certifications" value={profile.certifications} placeholder="Certifications" onChange={handleChange} />
      <input type="text" name="hackathonWinner" value={profile.hackathonWinner} placeholder="Hackathon Winner (Yes/No)" onChange={handleChange} />
      <button onClick={saveProfile}>Save Profile</button>
    </div>
  );
};

export default Profile;
