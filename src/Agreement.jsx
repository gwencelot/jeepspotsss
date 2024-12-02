import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Agreement() {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleAgree = () => {
    if (isChecked) {
      navigate("/dashboard"); // Redirect to Trip Schedule page
    } else {
      alert("Please agree to the terms and conditions.");
    }
  };

  return (
    <div className="agreement-page">
      <div className="agreement-container">
        <h2>Terms and Conditions</h2>
        <p>
          We are committed to protecting your personal data in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
          All information collected during booking will be used solely for the purpose of providing our services.
          Your data will not be shared with third parties without your consent unless required by law.
        </p>
      
        <p>
          <strong>Bookings must be made at least 1 day in advance.</strong> We cannot accommodate same-day bookings to ensure the quality of our service and proper scheduling.
        </p>

        <p>
          <strong>Cancellations can be made up to 3 hours before the booked date and time.</strong> If a cancellation is made within this time frame, the slot will be reopened and made available for other users.
        </p>

        <div className="checkbox-section">
          <input
            type="checkbox"
            id="agree"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="agree">
            I agree to the terms and conditions, including the Booking and Cancellation policies.
          </label>
        </div>
        <button onClick={handleAgree}>Proceed</button>
      </div>
    </div>
  );
}

export default Agreement;
