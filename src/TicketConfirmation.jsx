import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";

function TicketConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize ticket details from the previous page or empty state
  const [ticketDetails, setTicketDetails] = useState(location.state || {});
  const [studentId, setStudentId] = useState("");
  const [idLabel, setIdLabel] = useState("ID"); // Default label
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  // Fetch organization and studentId from localStorage
  useEffect(() => {
    const savedStudentId = localStorage.getItem("user_id");
    const savedOrganization = localStorage.getItem("organization");

    if (savedOrganization) {
      const label = savedOrganization === "Student" ? "Student ID" : `${savedOrganization} ID`;
      setIdLabel(label); // Set dynamic ID label based on organization
    }

    if (savedStudentId) {
      setStudentId(savedStudentId); // Set studentId from localStorage if available
    } else {
      setStudentId(ticketDetails.studentId || ""); // Use studentId from ticket details if provided
    }
  }, [ticketDetails]);

  const confirmTicket = () => {
    if (
      !ticketDetails.origin ||
      !ticketDetails.destination ||
      !ticketDetails.departureDate ||
      !ticketDetails.departureTime ||
      !studentId
    ) {
      alert("Missing required fields. Please check your details.");
      return;
    }

    // Fetch current seat availability
    const seatData = JSON.parse(localStorage.getItem("seatAvailability")) || {};
    const selectedDate = ticketDetails.departureDate;
    const availableSeats = seatData[selectedDate] || 0;

    if (availableSeats <= 0) {
      alert("No available seats for the selected date. Please choose another date.");
      return;
    }

    const updatedTicket = {
      ...ticketDetails,
      tripCode: ticketDetails.tripCode || "A1", // Default trip code
      isPWD: ticketDetails.isPWD || false,
    };

    // Update seat availability
    seatData[selectedDate] = availableSeats - 1;
    localStorage.setItem("seatAvailability", JSON.stringify(seatData));

    // Save the updated ticket to localStorage
    const savedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    savedTickets.push(updatedTicket);
    localStorage.setItem("tickets", JSON.stringify(savedTickets));

    alert("Ticket confirmed!");

    // Navigate to Trip Schedule with updated ticket data
    navigate("/tripschedule", { state: updatedTicket });
  };

  const handleEditTicket = () => {
    navigate("/dashboard", { state: ticketDetails }); // Navigate back to the dashboard with ticket details to edit
  };

  const handleConfirmClick = () => {
    setShowPopup(true); // Show the confirmation popup
  };

  const handlePopupClose = (confirm) => {
    setShowPopup(false); // Hide the popup
    if (confirm) {
      confirmTicket(); // Proceed with the ticket confirmation if user confirms
    }
  };

  return (
    <div className="ticket-confirmation-page">
      <Navbar />
      <div className="ticket-confirmation">
        <h2>Ticket Confirmation</h2>
        <p>
          <strong>{idLabel}:</strong> {studentId}
        </p>
        <p>
          <strong>Origin:</strong> {ticketDetails.origin}
        </p>
        <p>
          <strong>Destination:</strong> {ticketDetails.destination}
        </p>
        <p>
          <strong>Departure Date:</strong> {ticketDetails.departureDate}
        </p>
        <p>
          <strong>Departure Time:</strong> {ticketDetails.departureTime}
        </p>
        <p>
          <strong>College:</strong> {ticketDetails.college}
        </p>

        <div className="button-group">
          <button onClick={handleConfirmClick}>Confirm Booking</button>
          <button onClick={handleEditTicket}>Edit Ticket</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Confirm Booking</h3>
            <p>Are you sure you want to book this ticket?</p>
            <div className="popup-buttons">
              <button onClick={() => handlePopupClose(true)}>Yes</button>
              <button onClick={() => handlePopupClose(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketConfirmation;
