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
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What is HackMatch?",
      answer:
        "HackMatch is a platform that helps developers find teammates for hackathons based on skills, interests, and experience.",
    },
    {
      question: "How do I find teammates?",
      answer:
        "You can search for teammates based on skills, view profiles, and send connection requests to potential teammates.",
    },
    {
      question: "Can I create groups?",
      answer:
        "Yes! Once connected, you can create groups with your teammates and chat in real-time.",
    },
    {
      question: "How do I sign up?",
      answer:
        "You can sign up using Google authentication, which allows you to create a profile and start finding teammates instantly.",
    },
    {
      question: "Is HackMatch free to use?",
      answer:
        "Yes, HackMatch is completely free and designed to help you build your dream hackathon team effortlessly.",
    },
    {
      question: "Can I edit my profile after signing up?",
      answer:
        "Yes, you can update your profile information, including skills, links, and past hackathon experience.",
    },
  ];

  return (
    <div className="home-container">
      <header className="site-header">
        <div className="header-content">
          <h1 className="logo">HackMatch</h1>
          <p className="logo-tagline">Build Your Dream Team</p>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Build Your Dream Hackathon Team</h2>
            <p className="hero-subtitle">Connect. Collaborate. Conquer Hackathons.</p>
            <button onClick={handleGoogleLogin} className="get-started-btn">
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Get Started with Google
            </button>
          </div>
          <div className="hero-image-container">
            <img
              src="/images/hackmatch1-removebg-preview.png"
              alt="Teamwork illustration"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            fill="#f8f9fa"
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          ></path>
        </svg>
      </div>

      <section className="features-section">
        <h2 className="section-title">Why Choose HackMatch?</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon connect-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4M15,5.9A2.1,2.1 0 0,0 12.9,8A2.1,2.1 0 0,0 15,10.1A2.1,2.1 0 0,0 17.1,8A2.1,2.1 0 0,0 15,5.9M4,7V10H1V12H4V15H6V12H9V10H6V7H4M15,13C17.67,13 23,14.33 23,17V20H7V17C7,14.33 12.33,13 15,13M15,14.9C12,14.9 8.9,16.36 8.9,17V18.1H21.1V17C21.1,16.36 17.97,14.9 15,14.9Z" />
              </svg>
            </div>
            <h3>Connect</h3>
            <p>Find developers who share your passion and skills. Our matching algorithm helps you discover the perfect teammates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon collaborate-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.6,8.34C16.67,8.34 17.53,9.2 17.53,10.27C17.53,11.34 16.67,12.2 15.6,12.2A1.93,1.93 0 0,1 13.67,10.27C13.66,9.2 14.53,8.34 15.6,8.34M9.6,6.76C10.9,6.76 11.96,7.82 11.96,9.12C11.96,10.42 10.9,11.5 9.6,11.5C8.3,11.5 7.24,10.42 7.24,9.12C7.24,7.81 8.29,6.76 9.6,6.76M9.6,15.89V19.64C7.2,18.89 5.3,17.04 4.46,14.68C5.5,13.56 8.13,12.8 9.6,12.8C10.13,12.8 10.8,12.89 11.5,13.03C10.23,14.28 9.6,15.82 9.6,15.89M17.55,14.58C19.84,16.11 20.39,17.71 20.39,17.71C19.54,19.87 17.78,21.5 15.6,22.23V19.64C15.6,19.17 16.6,16.72 17.55,14.58Z" />
              </svg>
            </div>
            <h3>Collaborate</h3>
            <p>Create teams, chat in real-time, and build projects together. Our platform streamlines team communication.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon conquer-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.5,3H16.5C19,3 21,5 21,7.5C21,8.93 20.35,10.26 19.33,11.19L17.27,9.13C17.72,8.67 18,8.08 18,7.5C18,6.67 17.33,6 16.5,6H13V8L8.5,3.5L13,9H10.5V11H7.5C6.67,11 6,10.33 6,9.5C6,8.92 6.28,8.33 6.73,7.87L4.67,5.81C3.65,6.74 3,8.07 3,9.5C3,12 5,14 7.5,14H11V16L15.5,11.5L11,7V9H7.5C7.31,9 7.11,9 6.92,9.03C6.24,9.13 5.58,9.37 5,9.71V19H19V14.71C18.19,14.46 17.5,14 16.95,13.41L18.23,12.13C19.93,13.64 21,15.77 21,18V19C21,20.1 20.1,21 19,21H5C3.9,21 3,20.1 3,19V11.72C1.81,10.8 1,9.26 1,7.5C1,4.46 3.46,2 6.5,2H9.79C9.4,2.61 9.18,3.28 9.11,4H6.5C4.57,4 3,5.57 3,7.5C3,8.13 3.17,8.73 3.46,9.24C4.75,8.43 6.3,8 7.5,8C7.79,8 8.08,8.07 8.37,8.13L10.35,6.15C9.88,5.63 9.29,5.16 8.62,4.89C9.07,4.15 9.7,3.5 10.45,3.14C11.28,3.94 11.87,4.88 12.15,5.89C13.22,5.5 14.58,5.5 15.66,5.89C16.16,4.22 17.6,2.97 19.34,2.97C20.65,2.97 21.81,3.58 22.6,4.5C21.65,4.17 20.66,4.31 19.85,4.61C19.13,4.94 18.5,5.49 18,6.13C17.34,5.77 16.7,5.46 16,5.28C17.2,5.5 18.21,6.25 18.94,7.24C16.91,6.27 13.5,7.35 13.5,7.35L13.81,7.27C12.71,5.86 11.11,4.91 9.33,4.65L9.7,4.87C9.65,4.28 9.5,3.71 9.28,3.16C9.21,3.14 9.14,3.12 9.07,3.11C8.86,3.37 8.7,3.66 8.55,3.96C8.2,3.96 7.86,3.97 7.5,3Z" />
              </svg>
            </div>
            <h3>Conquer</h3>
            <p>Dominate hackathons with your dream team. Improve your chances of winning by connecting with the right people.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Profile</h3>
            <p>Sign up with Google and customize your developer profile with your skills and experience.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Find Teammates</h3>
            <p>Search for potential teammates based on skills, interests, and compatibility.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Build Your Team</h3>
            <p>Connect with teammates, form groups, and start collaborating on your next hackathon project.</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="arrow">{openFAQ === index ? "▲" : "▼"}</span>
              </button>
              {openFAQ === index && <p className="faq-answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Find Your Dream Team?</h2>
        <p>Join HackMatch today and connect with talented developers for your next hackathon.</p>
        <button onClick={handleGoogleLogin} className="cta-btn">
          Get Started Now
        </button>
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} HackMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;