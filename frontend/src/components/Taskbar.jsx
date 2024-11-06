// Taskbar.js
import React, { useState } from 'react';
import './Taskbar.css';
import { FaUserCircle, FaSearch, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import logo from '../assets/comply-logo-white.svg';

const Taskbar = ({ onDropdownChange }) => {  // Add `onDropdownChange` prop
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);
  const toggleNotificationMenu = () => setNotificationOpen(!isNotificationOpen);

  const notifications = [
    "File upload completed.",
    "Audit Report has been reviewed.",
    "New document added to the library.",
    "Compliance check passed successfully.",
  ];

  // Handle dropdown changes and call the parent function
  const handleDropdownChange = (event, dropdownType) => {
    onDropdownChange(dropdownType, event.target.value);
  };

  return (
    <div className="taskbar">
      <div className="logo">
        <img src={logo} alt="Comply Logo" className="logo-img" />
        <span>COMPLY</span>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search documents, reports, etc." />
        <FaSearch className="search-icon" />
      </div>

      {/* Dropdown Section */}
      <div className="dropdown-group">
        <select className="dropdown" onChange={(e) => handleDropdownChange(e, 'documentType')}>
          <option>Document Type</option>
          <option>Deviation Report</option>
          <option>SOP Report</option>
          <option>JSA Report</option>
          <option>EIA Report</option>
        </select>

        <select className="dropdown" onChange={(e) => handleDropdownChange(e, 'section')}>
          <option>Section</option>
          <option>Deviation Description</option>
          <option>Impact Assessment</option>
          <option>Root Cause Analysis</option>
          <option>Corrective Actions</option>
          <option>Preventive Actions</option>
          <option>Investigation Procedure</option>
          <option>Quality Assurance Review</option>
          <option>CAPA Implementation</option>
          <option>Supporting Documents</option>
          <option>Approval and Closure</option>
        </select>
      </div>

      <div className="notification-menu" onClick={toggleNotificationMenu}>
        <FaBell className="notification-icon" />
        {isNotificationOpen && (
          <div className="notification-dropdown">
            {notifications.length ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {notification}
                </div>
              ))
            ) : (
              <div className="notification-item">No new notifications</div>
            )}
          </div>
        )}
      </div>

      <div className="profile-menu" onClick={toggleProfileMenu}>
        <FaUserCircle className="profile-icon" />
        {isProfileMenuOpen && (
          <div className="dropdown-content">
            <button className="profile-btn">
              <FaCog className="dropdown-icon" /> Settings
            </button>
            <button className="logout-btn">
              <FaSignOutAlt className="dropdown-icon" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Taskbar;
