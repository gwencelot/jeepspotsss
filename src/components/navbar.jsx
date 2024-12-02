// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Logo from "../assets/images/logo.png";
import CsuLogo from "../assets/images/csu.png";
import Logout from './logout';  // Import the Logout component
import "../App.css";

const Navbar = () => {
  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <img src={Logo} alt="logo" className="navbar-logo" />
        <img src={CsuLogo} alt="CSU logo" className="csu-logo" />
        
        {/* Use the Logout component in the navbar */}
        <Logout />
      </nav>
    </div>
  );
};

export default Navbar;
