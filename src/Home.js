import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate("/dashboard"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="home-container">
      <h1>HackMatch - Build Your Dream Team</h1>
      <p>Find and connect with teammates for your next hackathon.</p>
      <button onClick={handleGoogleLogin} className="get-started-btn">
        Get Started with Google
      </button>
    </div>
  );
};

export default Home;
