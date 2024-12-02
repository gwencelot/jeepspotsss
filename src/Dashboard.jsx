import React, { useState, useEffect } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Calendar from "./Calendar";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const locations = ["CSU", "Tiniwisan", "Baan KM3", "Plaza", "SM", "Robinsons"];
  const colleges = ["CCIS", "CED", "CEGS", "CMNS", "COFES", "CAA", "CHASS"];

  // Set the default date to today
  const todayDate = new Date().toISOString().split("T")[0];
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(todayDate);

  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [studentId, setStudentId] = useState("");
  const [organizationLabel, setOrganizationLabel] = useState("ID");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const savedOrganization = localStorage.getItem("organization");
    const savedUserId = localStorage.getItem("user_id");
    const savedDate = localStorage.getItem("selectedDate");

    if (savedOrganization) {
      const label =
        savedOrganization === "Student" ? "Student ID" : `${savedOrganization} ID`;
      setOrganizationLabel(label);
    }

    if (savedUserId) setStudentId(savedUserId);
    if (savedDate) {
      setSelectedDepartureDate(savedDate);
    }

    if (location.state) {
      setSelectedOrigin(location.state.origin || "");
      setSelectedDestination(location.state.destination || "");
      setSelectedDepartureTime(location.state.departureTime || "");
      setSelectedCollege(location.state.college || "");
    }
  }, [location.state]);

  const handleDateClick = (date) => {
    setSelectedDepartureDate(date);
    localStorage.setItem("selectedDate", date);
    setIsCalendarOpen(false);
  };

  const handleSubmit = () => {
    if (
      !studentId ||
      !selectedOrigin ||
      !selectedDestination ||
      !selectedDepartureDate ||
      !selectedDepartureTime ||
      !selectedCollege
    ) {
      alert("Please fill out all the fields.");
      return;
    }

    // Update seat availability
    const seatData = JSON.parse(localStorage.getItem("seatAvailability")) || {};
    if (seatData[selectedDepartureDate] && seatData[selectedDepartureDate] !== "Holiday") {
      seatData[selectedDepartureDate] = Math.max(0, seatData[selectedDepartureDate] - 1);
      localStorage.setItem("seatAvailability", JSON.stringify(seatData));
    }

    const formData = {
      studentId,
      userId: localStorage.getItem("user_id"), // Add user ID
      organization: localStorage.getItem("organization"), // Add organization
      origin: selectedOrigin,
      destination: selectedDestination,
      departureDate: selectedDepartureDate,
      departureTime: selectedDepartureTime,
      college: selectedCollege,
      tripCode: `TRIP-${new Date().getTime()}`,
      status: 'scheduled',
      bookedAt: new Date().toISOString()
    };

    // Store in tickets array
    const savedTrips = JSON.parse(localStorage.getItem("tickets")) || [];
    savedTrips.push(formData);
    localStorage.setItem("tickets", JSON.stringify(savedTrips));

    navigate("/ticket", { state: formData });
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="main-layout">
        {/* Right side - Booking Form */}
        <div className="booking-panel">
          <h1>Find your Seat Now</h1>
          <div className="booking-form">
            <div className="form-group">
              <label>{organizationLabel}</label>
              <input type="text" value={studentId} readOnly />
            </div>
            <div className="form-group">
              <label>Origin</label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
              >
                <option value="">Select Origin</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Destination</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              >
                <option value="">Select Destination</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Departure Date</label>
              <input
                type="text"
                value={selectedDepartureDate}
                readOnly
                placeholder="Click to select a date"
                onFocus={() => setIsCalendarOpen(true)}
              />
            </div>
            <div className="form-group">
              <label>Departure Time</label>
              <select
                value={selectedDepartureTime}
                onChange={(e) => setSelectedDepartureTime(e.target.value)}
              >
                <option value="">Select Departure Time</option>
                {[
                  "7:00 - 9:00 AM",
                  "9:00 - 11:00 AM",
                  "11:00 AM - 1:00 PM",
                  "1:00 - 3:00 PM",
                  "3:00 - 5:00 PM",
                  "5:00 - 7:00 PM",
                ].map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>College</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
            <button className="submit-button" onClick={handleSubmit}>
              Book a Seat
            </button>
          </div>
        </div>

        {/* Left side - Calendar */}
        <div className="calendar-panel">
          <Calendar onDateSelect={handleDateClick} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
