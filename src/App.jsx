import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import TripSchedule from "./TripSchedule";
import Dashboard from "./Dashboard";
import TicketConfirmation from './TicketConfirmation';
import Agreement from './Agreement';
import TripHistory from './TripHistory';

function App() {
  const [organization, setOrganization] = useState(localStorage.getItem("organization") || "Student");

  // UseEffect to sync organization from localStorage on initial load
  useEffect(() => {
    const savedOrganization = localStorage.getItem("organization");
    if (savedOrganization) {
      setOrganization(savedOrganization);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/" element={<Login setOrganization={setOrganization} />} />
        <Route path="/trips" element={<TripSchedule />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket" element={<TicketConfirmation />} />
        <Route path="/tripschedule" element={<TripSchedule />} />
        <Route path="/triphistory" element={<TripHistory />} />
      </Routes>
    </Router>
  );
}

export default App;  