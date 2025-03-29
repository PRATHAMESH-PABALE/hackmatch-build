import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Dashboard from ".//Dashboard";
import ProfileSetup from "./ProfileSetup";
import FindTeammates from "./FindTeammates";
import Requests from "./Requests";
import Connections from "./Connections";
import AboutUs from "./AboutUs";
import Groups from "./Groups";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/find-teammates" element={<FindTeammates />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/groups" element={<Groups />} />
      </Routes>
    </Router>
  );
}

export default App;
