import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import "./AboutUs.css"; 

const RoadmapGenerator = () => {
  const [formData, setFormData] = useState({
    problemStatement: "",
    duration: "",
    domain: "",
    projectIdea: "",
    teamSize: "",
    teamMembers: [],
  });

  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle team members' expertise inputs dynamically
  const handleTeamChange = (index, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = value;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  // Fetch roadmap from Gemini AI
  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Generate a concise and structured roadmap for a hackathon project based on the following details:
        - **Problem Statement:** ${formData.problemStatement}
        - **Hackathon Duration:** ${formData.duration} hours
        - **Domain:** ${formData.domain}
        - **Project Idea:** ${formData.projectIdea}
        - **Team Size:** ${formData.teamSize}
        - **Team Members Expertise:** ${formData.teamMembers.join(", ")}

        Format the roadmap into 4 concise phases:
        1️⃣ **Ideation & Research** - Define goals, research solutions.
        2️⃣ **Development & Design** - UI, backend setup, feature implementation.
        3️⃣ **Testing & Optimization** - Debugging, performance enhancement.
        4️⃣ **Submission & Presentation** - Final touches, documentation, pitching.

        Keep responses **short and to the point** with **clear bullet points**.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Remove extra ** from Gemini output
      const formattedRoadmap = response.replace(/\*/g, "").trim();
      setRoadmap(formattedRoadmap);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setRoadmap("Failed to generate roadmap. Please try again.");
    }
    setLoading(false);
  };

  // Convert Roadmap to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Hackathon Roadmap", 10, 10);
    doc.setFont("helvetica", "normal");

    // Split text into lines to avoid cutting off content
    const lines = doc.splitTextToSize(roadmap, 180); 
    let y = 20;
    
    lines.forEach(line => {
      if (y > 270) { // Move to a new page if content exceeds
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 7;
    });

    doc.save("Hackathon_Roadmap.pdf");
  };

  return (
    <div className="roadmap-container">
      <h2>Hackathon Roadmap Generator</h2>
      <div className="form-group">
        <label>Problem Statement</label>
        <input type="text" name="problemStatement" value={formData.problemStatement} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Hackathon Duration (in hours)</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Domain</label>
        <input type="text" name="domain" value={formData.domain} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Project Idea</label>
        <input type="text" name="projectIdea" value={formData.projectIdea} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Team Size</label>
        <input
          type="number"
          name="teamSize"
          value={formData.teamSize}
          onChange={(e) => {
            const newSize = parseInt(e.target.value, 10);
            setFormData({ ...formData, teamSize: newSize, teamMembers: Array(newSize).fill("") });
          }}
        />
      </div>
      {formData.teamMembers.map((_, index) => (
        <div className="form-group" key={index}>
          <label>Team Member {index + 1} Expertise</label>
          <input type="text" value={formData.teamMembers[index]} onChange={(e) => handleTeamChange(index, e.target.value)} />
        </div>
      ))}
      <button onClick={generateRoadmap} disabled={loading} className="generate-btn">
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>
      {roadmap && (
        <div className="roadmap-result">
          <h3>Generated Roadmap</h3>
          <pre>{roadmap}</pre>
          <button onClick={downloadPDF} className="download-btn">Download as PDF</button>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
