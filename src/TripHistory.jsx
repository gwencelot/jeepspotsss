import React, { useState, useEffect, useMemo } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Keep only the necessary map bounds for Butuan City
const BUTUAN_BOUNDS = {
  center: [8.9475, 125.5406],
  bounds: [
    [8.9275, 125.5206], // Southwest
    [8.9675, 125.5606]  // Northeast
  ],
  maxZoom: 16,
  minZoom: 13
};

// Map component with bounds
function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(BUTUAN_BOUNDS.bounds);
  }, [map]);
  return null;
}

function TripHistory() {
  // Add new state for screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Add screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [tripHistory, setTripHistory] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("organization") || "Student");
  const [activeTab, setActiveTab] = useState('upcoming');
  const [tripStatus, setTripStatus] = useState({});
  const [filterDate, setFilterDate] = useState('');
  const [tripStats, setTripStats] = useState({
    totalTrips: 0,
    pwdPassengers: 0
  });

  // Memoize routes to prevent re-renders
  const routes = useMemo(() => ({
    "CSU-Plaza": [
      { lat: 8.9475, lng: 125.5406, name: "CSU" },
      { lat: 8.9456, lng: 125.5427, name: "Checkpoint 1" },
      { lat: 8.9438, lng: 125.5449, name: "Checkpoint 2" },
      { lat: 8.9420, lng: 125.5470, name: "Plaza" }
    ]
  }), []);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("tickets")) || [];
    const currentDate = new Date();
    const userId = localStorage.getItem("user_id");
    const userRole = localStorage.getItem("organization");

    // Update status for past trips
    const updatedTrips = savedTrips.map(trip => {
      const tripDate = new Date(trip.departureDate);
      if (tripDate < currentDate) {
        return { ...trip, status: 'completed' };
      }
      return trip;
    });

    // Save updated trips back to localStorage
    localStorage.setItem("tickets", JSON.stringify(updatedTrips));

    // Filter trips based on user role and ID
    const filterTrips = (trips) => {
      if (userRole === "Driver") {
        return trips;
      }
      return trips.filter(trip => trip.userId === userId);
    };

    const filteredSavedTrips = filterTrips(updatedTrips);

    // Separate into past and upcoming with proper status
    const pastTrips = filteredSavedTrips.filter(
      (trip) => new Date(trip.departureDate) < currentDate
    );
    const futureTrips = filteredSavedTrips.filter(
      (trip) => new Date(trip.departureDate) >= currentDate
    );

    setTripHistory(pastTrips);
    setUpcomingTrips(futureTrips);

    // Set initial trip statuses
    const initialStatuses = {};
    updatedTrips.forEach(trip => {
      initialStatuses[trip.tripCode] = trip.status || 'scheduled';
    });
    setTripStatus(initialStatuses);

    // Calculate statistics - FIXED HERE
    setTripStats({
      totalTrips: filteredSavedTrips.length, // This will now show total number of trips
      pwdPassengers: filteredSavedTrips.length // Changed to count all passengers
    });
  }, []);

  // Remove or comment out this useEffect as it's overwriting our statistics
  /*
  useEffect(() => {
    if (tripHistory.length > 0) {
      const stats = {
        totalTrips: tripHistory.length,
        pwdPassengers: tripHistory.filter(trip => trip.pwd).length
      };
      setTripStats(stats);
    }
  }, [tripHistory]);
  */

  const viewDetails = (trip) => {
    setSelectedTrip(trip);
  };

  const closeDetails = () => {
    setSelectedTrip(null);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleStatusChange = (tripCode, newStatus) => {
    const savedTrips = JSON.parse(localStorage.getItem("tickets")) || [];
    const updatedTrips = savedTrips.map(trip => {
      if (trip.tripCode === tripCode) {
        return { ...trip, status: newStatus };
      }
      return trip;
    });

    localStorage.setItem("tickets", JSON.stringify(updatedTrips));
    setTripStatus(prev => ({
      ...prev,
      [tripCode]: newStatus
    }));
  };

  const filteredTrips = useMemo(() => {
    let trips = activeTab === 'upcoming' ? upcomingTrips : tripHistory;
    if (filterDate) {
      trips = trips.filter(trip => trip.departureDate === filterDate);
    }
    return trips;
  }, [activeTab, upcomingTrips, tripHistory, filterDate]);

  return (
    <div className="trip-history-page"> {/* Add this wrapper */}
      <div className="trip-history">
        <Navbar />
        <div className="driver-dashboard">
          <div className="dashboard-header">
            <h1>Driver Dashboard</h1>
          </div>

          <div className="dashboard-grid">
            {/* Stats Section */}
            <div className="stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Trips</h3>
                  <p>{tripStats.totalTrips}</p>
                </div>
                {/* Removed the Total No. Of Passengers stat card */}
              </div>
            </div>

            {/* Map Section */}
            {role === "Driver" && (
              <div className="map-section">
                <h2>Butuan City Map</h2>
                <div className="map-container">
                  <MapContainer 
                    center={BUTUAN_BOUNDS.center}
                    zoom={isMobile ? 14 : 13}
                    style={{ 
                      height: isMobile ? (window.innerWidth <= 360 ? '200px' : '250px') : '400px',
                      width: '100%', 
                      borderRadius: '8px'
                    }}
                    maxZoom={BUTUAN_BOUNDS.maxZoom}
                    minZoom={BUTUAN_BOUNDS.minZoom}
                    zoomControl={!isMobile}
                    dragging={!isMobile || window.innerWidth > 480}
                    tap={true} // Enable tap for Samsung touch devices
                    touchZoom={window.innerWidth > 360}
                    doubleClickZoom={window.innerWidth > 360}
                    renderer={L.canvas()} // Better performance on Samsung devices
                  >
                    <MapBounds />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                      tileSize={256}
                      maxNativeZoom={18}
                      minNativeZoom={13}
                      updateWhenIdle={true}
                      updateWhenZooming={false}
                      keepBuffer={2}
                    />
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Trips Management Section */}
            <div className="trips-section">
              <div className="trips-header">
                <div className="trip-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Upcoming Trips
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                  >
                    Past Trips
                  </button>
                </div>

                <div className="trips-controls">
                  <div className="date-filter">
                    <input 
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      placeholder="Filter by date"
                    />
                    <button className="clear-btn" onClick={() => setFilterDate('')}>Clear</button>
                  </div>
                </div>
              </div>

              {/* Trips Table */}
              <div className="trips-table-container">
                {filteredTrips.length > 0 ? (
                  <table className="trip-history-table">
                    <thead>
                      <tr>
                        <th>Trip Code</th>
                        <th>Route</th>
                        <th>Date & Time</th>
                        <th>PWD Count</th>
                        <th>Available Seats</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips.map((trip, index) => (
                        <tr key={index}>
                          <td>{trip.tripCode}</td>
                          <td>{`${trip.origin || ''} - ${trip.destination || ''}`}</td>
                          <td>{`${trip.departureDate} ${trip.departureTime}`}</td>
                          <td>{trip.pwd ? "1" : "0"}</td>
                          <td>
                            {(() => {
                              // Get seat data from localStorage
                              const seatData = JSON.parse(localStorage.getItem("seatAvailability")) || {};
                              return seatData[trip.departureDate] || 20; // Default to 20 if no data
                            })()}
                          </td>
                          <td>
                            <select 
                              value={tripStatus[trip.tripCode] || 'scheduled'}
                              onChange={(e) => handleStatusChange(trip.tripCode, e.target.value)}
                              className={`status-select ${tripStatus[trip.tripCode] || 'scheduled'}`}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button 
                              className="view-details-btn"
                              onClick={() => viewDetails(trip)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-trips">No trips available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Trip Details Modal */}
          {selectedTrip && (
            <div className="modal show" onClick={closeDetails}>
              <div 
                className="modal-content" 
                onClick={handleModalClick}
                style={{
                  width: window.innerWidth <= 360 ? '95%' : '90%',
                  padding: window.innerWidth <= 360 ? '0.8rem' : '1rem',
                  maxHeight: window.innerHeight * 0.8,
                  overflowY: 'auto'
                }}
              >
                <div className="trip-details-header">
                  <h3>{isMobile ? 'Trip Info' : 'Trip Details'}</h3>
                  <button 
                    className="close-btn" 
                    onClick={closeDetails}
                    style={{ padding: isMobile ? '12px' : '8px' }}
                  >
                    ×
                  </button>
                </div>
                <p>
                  <span className="detail-label">Trip Code:</span>{" "}
                  <span className="detail-value">{selectedTrip.tripCode}</span>
                </p>
                <p>
                  <span className="detail-label">Route:</span>{" "}
                  <span className="detail-value">{selectedTrip.route}</span>
                </p>
                <p>
                  <span className="detail-label">Departure Date:</span>{" "}
                  <span className="detail-value">{selectedTrip.departureDate}</span>
                </p>
                <p>
                  <span className="detail-label">Departure Time:</span>{" "}
                  <span className="detail-value">{selectedTrip.departureTime}</span>
                </p>
                <p>
                  <span className="detail-label">PWD:</span>{" "}
                  <span className="detail-value">{selectedTrip.pwd ? "1" : "0"}</span>
                </p>
                <p>
                  <span className="detail-label">Available Seats:</span>{" "}
                  <span className="detail-value">{selectedTrip.availableSeats}</span>
                </p>
                <div className="trip-actions" style={{ 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '0.8rem' : '1rem' 
                }}>
                  <button onClick={() => handleStatusChange(selectedTrip.tripCode, 'in-progress')}>
                    Start Trip
                  </button>
                  <button onClick={() => handleStatusChange(selectedTrip.tripCode, 'completed')}>
                    Complete Trip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TripHistory;
