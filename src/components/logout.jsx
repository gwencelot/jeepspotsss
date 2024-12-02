import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import "../App.css";

const Logout = () => {
  const navigate = useNavigate();  // Initialize useNavigate for programmatic navigation
  const [showPopup, setShowPopup] = useState(false);  // State to toggle popup visibility

  const handleLogout = () => {
    setShowPopup(true);  // Show the popup when logout button is clicked
  };

  const confirmLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    navigate('/');  // Redirect to login page
    setShowPopup(false);  // Close the popup after logout
  };

  const cancelLogout = () => {
    setShowPopup(false);  // Close the popup without logging out
  };

  return (
    <div>
      <button className="logout-btn" onClick={handleLogout}>Log Out</button>

      {/* Display the logout confirmation popup */}
      {showPopup && (
        <div className='logout-design'>
          <div className="logout-popup">
            <div className="logout-popup-content">
              <h3>Are you sure you want to log out?</h3>
              <p>Please confirm your action.</p>
              <div className="popup-buttons">
                <button onClick={confirmLogout}>Yes</button>
                <button onClick={cancelLogout}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
