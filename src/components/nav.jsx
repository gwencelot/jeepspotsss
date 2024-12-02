import React from 'react';

import Logo from "../assets/images/logo.png"
import "../App.css"
import CsuLogo from "../assets/images/csu.png"

const Nav = () => {

  return (
    <div className='min-h-screen'>
      <nav className="navbar">
        <img src={Logo} alt="logo" className="navbar-logo" />
         <img src={CsuLogo} alt="CSU logo" className="csu-logo" />

      </nav>
    </div>
  );
};

export default Nav;
