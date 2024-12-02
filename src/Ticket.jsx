import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import './App.css';

function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();

  const ticketDetails = location.state || {
    origin: 'Unknown',
    destination: 'Unknown',
    departureDate: 'Unknown',
    departureTime: 'Unknown',
    college: 'Unknown',
    availableSeats: 10,
    tripCode: 'A1',
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const handleConfirmBooking = () => {
    setIsLoading(true);
  
    // Combine origin and destination into a route
    const updatedTicketData = {
      ...ticketDetails,
      route: `${ticketDetails.origin} - ${ticketDetails.destination}`, // Add route
      availableSeats: Math.max(ticketDetails.availableSeats - 1, 0), // Prevent negative seats
    };
  
    setTimeout(() => {
      alert('Ticket booked successfully!');
      // Navigate to the Trip Schedule page with the updated ticket data
      navigate('/tripschedule', { state: updatedTicketData });
      setIsLoading(false);
    }, 1000);
  };
  

  const handleEditTicket = () => {
    navigate('/dashboard', { state: ticketDetails });
  };

  return (
    <div className="ticket-confirmation">
      <Navbar />
      <h1>Your Ticket Details</h1>
      <div className="ticket-details">
        <p><strong>Origin:</strong> {ticketDetails.origin}</p>
        <p><strong>Destination:</strong> {ticketDetails.destination}</p>
        <p><strong>Departure Date:</strong> {ticketDetails.departureDate}</p>
        <p><strong>Departure Time:</strong> {ticketDetails.departureTime}</p>
        <p><strong>College:</strong> {ticketDetails.college}</p>
        <p><strong>Available Seats:</strong> {ticketDetails.availableSeats}</p>
      </div>
      <button
        className="confirm-booking-button"
        onClick={handleConfirmBooking}
        disabled={isLoading || ticketDetails.availableSeats <= 0}
      >
        {isLoading ? 'Processing...' : 'Confirm Booking'}
      </button>
      <button
        className="confirm-booking-button" // Reuse this class or create a unique one for the edit button
        onClick={handleEditTicket}
        disabled={isLoading}
        style={{ marginLeft: '10px' }}
      >
        Edit Ticket
      </button>
      <Footer />
    </div>
  );
}

export default Ticket;
