import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./Home.jsx"));
const Dashboard = lazy(() => import("./Dashboard.jsx"));
const ProfileSetup = lazy(() => import("./ProfileSetup.jsx"));
const FindTeammates = lazy(() => import("./FindTeammates.jsx"));
const Requests = lazy(() => import("./Requests.jsx"));
const Connections = lazy(() => import("./Connections.jsx"));
const AboutUs = lazy(() => import("./AboutUs.jsx"));
const Groups = lazy(() => import("./Groups.jsx"));


function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </Router>
  );
}

export default App;
