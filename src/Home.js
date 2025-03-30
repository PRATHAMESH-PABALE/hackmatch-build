import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    { question: "What is HackMatch?", answer: "HackMatch is a platform that helps developers find teammates for hackathons based on skills, interests, and experience." },
    { question: "How do I find teammates?", answer: "You can search for teammates based on skills, view profiles, and send connection requests to potential teammates." },
    { question: "Can I create groups?", answer: "Yes! Once connected, you can create groups with your teammates and chat in real-time." },
    { question: "How do I sign up?", answer: "You can sign up using Google authentication, which allows you to create a profile and start finding teammates instantly." },
    { question: "Is HackMatch free to use?", answer: "Yes, HackMatch is completely free and designed to help you build your dream hackathon team effortlessly." },
    { question: "Can I edit my profile after signing up?", answer: "Yes, you can update your profile information, including skills, links, and past hackathon experience." },
  ];

  return (
    <div className="home-container">
      <h1 className="title">HackMatch - Build Your Dream Team</h1>
      <p className="description">
        HackMatch is the ultimate platform to find the perfect teammates for hackathons.  
        Connect with like-minded developers, form groups, and collaborate to build amazing projects.  
        Whether you're a beginner or an experienced coder, HackMatch helps you find the right people  
        based on skills, interests, and past hackathon experience.
      </p>

      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span>{openFAQ === index ? "▲" : "▼"}</span>
            </button>
            {openFAQ === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>

      <button onClick={handleGoogleLogin} className="get-started-btn">
        Get Started with Google
      </button>
    </div>
  );
};

export default Home;
