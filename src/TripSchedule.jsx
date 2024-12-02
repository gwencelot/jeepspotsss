import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "./App.css";

function TripSchedule() {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigation hook
  const ticketDetails = location.state;
  
  const [disabilityCount, setDisabilityCount] = useState(0);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (ticketDetails) {
      // Fetch tickets from localStorage
      const allTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      const seatData = JSON.parse(localStorage.getItem("seatAvailability")) || {};

      // Count tickets where `isPWD` is true and match the current trip
      const count = allTickets.filter(
        (ticket) =>
          ticket.origin === ticketDetails.origin &&
          ticket.destination === ticketDetails.destination &&
          ticket.departureDate === ticketDetails.departureDate &&
          ticket.isPWD === true
      ).length;

      setDisabilityCount(count);

      // Fetch available seats for the departure date from localStorage
      const seatsForDate = seatData[ticketDetails.departureDate] || 0;
      setAvailableSeats(seatsForDate);
    }
  }, [ticketDetails]);

  const handleCancelTrip = () => {
    // Show confirmation modal
    setShowCancelModal(true);
  };

  const confirmCancelTrip = () => {
    // Get existing tickets
    const allTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    
    // Remove the current ticket
    const updatedTickets = allTickets.filter(
      ticket => ticket.tripCode !== ticketDetails.tripCode
    );
    
    // Update localStorage
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));

    // Update seat availability
    const seatData = JSON.parse(localStorage.getItem("seatAvailability")) || {};
    if (seatData[ticketDetails.departureDate]) {
      seatData[ticketDetails.departureDate] += 1; // Add seat back to availability
      localStorage.setItem("seatAvailability", JSON.stringify(seatData));
    }

    // Close modal and navigate back to dashboard
    setShowCancelModal(false);
    navigate("/dashboard");
  };

  if (!ticketDetails) {
    return <p>No trip details available. Please book a ticket first.</p>;
  }

  return (
    <div className="trip-schedule-page">
      <Navbar />
      <div className="trip-schedule-container">
        <h1 className="schedule-header">Trip Schedule</h1>
        <div className="schedule-content">
          <table className="trip-schedule-table">
            <thead>
              <tr>
                <th>Trip Code</th>
                <th>Route</th>
                <th>Departure Date</th>
                <th>Departure Time</th>
                <th>Available Seats</th>
                <th>PWD Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{ticketDetails.tripCode || "TRIP001"}</td>
                <td>{`${ticketDetails.origin} - ${ticketDetails.destination}`}</td>
                <td>{ticketDetails.departureDate}</td>
                <td>{ticketDetails.departureTime}</td>
                <td>{availableSeats}</td>
                <td>{disabilityCount}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Add Cancel Button */}
          <button 
            className="cancel-trip-button"
            onClick={handleCancelTrip}
          >
            Cancel Trip
          </button>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="modal show" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="trip-details-header">
              <h3>Cancel Trip</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            <p>Are you sure you want to cancel this trip?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="confirm-cancel-btn"
                onClick={confirmCancelTrip}
              >
                Yes, Cancel Trip
              </button>
              <button 
                className="keep-trip-btn"
                onClick={() => setShowCancelModal(false)}
              >
                No, Keep Trip
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default TripSchedule;
