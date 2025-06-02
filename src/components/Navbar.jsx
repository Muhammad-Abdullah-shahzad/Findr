import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";  // import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" className="logo-link">
          <strong>findIT</strong>
        </NavLink>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "link active-link" : "link"} end>
          Home
        </NavLink>
        <NavLink to="/lostItemsList" className={({ isActive }) => isActive ? "link active-link" : "link"}>
          Lost Items
        </NavLink>
        <NavLink to="/FoundItemList" className={({ isActive }) => isActive ? "link active-link" : "link"}>
          Found Items
        </NavLink>
        <NavLink to="/lostItemReportPage" className={({ isActive }) => isActive ? "link active-link" : "link"}>
          Report Lost Item
        </NavLink>
        <NavLink to="/foundItemReportPage" className={({ isActive }) => isActive ? "link active-link" : "link"}>
          Report Found Item
        </NavLink>
        <NavLink to="/userDashboard" className={({ isActive }) => isActive ? "link active-link" : "link"}>
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
