import React, { useState, useEffect } from "react";
import "./App.css";

const Calendar = ({ onDateSelect }) => {
  const philippineHolidays = [
    "2024-01-01", // New Year's Day
    "2024-02-10", // Chinese New Year
    "2024-02-25", // EDSA People Power Revolution Anniversary
    "2024-03-28", // Maundy Thursday
    "2024-03-29", // Good Friday
    "2024-03-30", // Black Saturday (Special Non-working)
    "2024-04-09", // Araw ng Kagitingan
    "2024-05-01", // Labor Day
    "2024-06-12", // Independence Day
    "2024-08-19", // Ninoy Aquino Day
    "2024-08-26", // National Heroes Day
    "2024-11-01", // All Saints' Day
    "2024-11-02", // All Souls' Day (Special Non-working)
    "2024-11-30", // Bonifacio Day
    "2024-12-08", // Feast of the Immaculate Conception
    "2024-12-24", // Christmas Eve (Special Non-working)
    "2024-12-25", // Christmas Day
    "2024-12-30", // Rizal Day
    "2024-12-31", // New Year's Eve (Special Non-working)
    "2025-01-01", // New Year's Day
  ];

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [seats, setSeats] = useState({});

  useEffect(() => {
    const seatData = JSON.parse(localStorage.getItem("seatAvailability")) || {};
    const savedTrips = JSON.parse(localStorage.getItem("tickets")) || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfYear = new Date(today.getFullYear() + 1, 0, 1);

    // Calculate booked seats per date
    const bookedSeats = savedTrips.reduce((acc, trip) => {
      const date = trip.departureDate;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Start from beginning of current year
    const startDate = new Date(today.getFullYear(), 0, 1);

    for (let d = new Date(startDate); d <= endOfYear; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      
      if (!seatData[dateKey]) {
        if (philippineHolidays.includes(dateKey)) {
          seatData[dateKey] = "Holiday";
        } else if (d >= tomorrow) {
          // Set available seats (20 minus booked seats)
          const booked = bookedSeats[dateKey] || 0;
          seatData[dateKey] = Math.max(0, 20 - booked);
        } else {
          const dateNum = parseInt(dateKey.replace(/-/g, ''));
          seatData[dateKey] = (dateNum % 20) + 1;
        }
      }
    }

    localStorage.setItem("seatAvailability", JSON.stringify(seatData));
    setSeats(seatData);
  }, [philippineHolidays]);

  const handleMonthChange = (direction) => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + direction,
      1
    );
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = [];
    const firstDayOfWeek = startOfMonth.getDay();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Add empty cells for days before start of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysInMonth.push(<td key={`empty-${i}`} className="empty"></td>);
    }

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const seatInfo = seats[dateKey];
      const isPastDate = d < tomorrow; // Changed from today to tomorrow

      daysInMonth.push(
        <td
          key={dateKey}
          onClick={() => !isPastDate && seatInfo !== "Holiday" && seatInfo > 0 && onDateSelect(dateKey)}
          className={`
            ${seatInfo === "Holiday" ? "holiday" : "available"}
            ${isPastDate ? "unavailable" : ""}
            ${seatInfo === 0 ? "full" : ""}
          `}
          style={{ cursor: (isPastDate || seatInfo === 0) ? 'not-allowed' : 'pointer' }}
        >
          <div>{d.getDate()}</div>
          <small>
            {seatInfo === "Holiday" ? "Holiday" : 
             isPastDate ? "Not Available" :
             seatInfo === 0 ? "Full" :
             `${seatInfo} seats`}
          </small>
        </td>
      );
    }
    return daysInMonth;
  };

  const renderWeeks = () => {
    const days = renderCalendar();
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(<tr key={`week-${i}`}>{days.slice(i, i + 7)}</tr>);
    }
    return weeks;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange(-1)}>←</button>
        <h2>
          {currentMonth.toLocaleString("en-US", { month: "long" })} {currentMonth.getFullYear()}
        </h2>
        <button onClick={() => handleMonthChange(1)}>→</button>
      </div>
      <table className="calendar">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{renderWeeks()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
