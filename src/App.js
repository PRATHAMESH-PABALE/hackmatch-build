import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ManageWork from "./ManageWork";

const Home = lazy(() => import("./Home"));
const Dashboard = lazy(() => import("./Dashboard"));
const ProfileSetup = lazy(() => import("./ProfileSetup"));
const FindTeammates = lazy(() => import("./FindTeammates"));
const Requests = lazy(() => import("./Requests"));
const Connections = lazy(() => import("./Connections"));
const AboutUs = lazy(() => import("./AboutUs"));
const Groups = lazy(() => import("./Groups"));


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
          <Route path="/manage-work" element={<ManageWork />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
