import React, { useState } from 'react';
import './Sidebar.css';
import { FaUserAlt, FaPlusCircle, FaTimes, FaCheckCircle, FaChalkboardTeacher } from 'react-icons/fa';

const Sidebar = () => {
  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleAddEmail = () => {
    if (email && !collaborators.includes(email)) {
      setCollaborators([...collaborators, email]);
      setEmail('');
    }
  };

  const handleRemoveCollaborator = (emailToRemove) => {
    setCollaborators(collaborators.filter(email => email !== emailToRemove));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Collaborators</h3>
        <div className="email-input-container">
          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={handleEmailChange}
            className="email-input-field"
          />
          <button onClick={handleAddEmail} className="add-button">
            <FaPlusCircle className="icon" /> Add
          </button>
        </div>
        <div className="collaborators-list">
          {collaborators.length ? (
            collaborators.map((user, index) => (
              <div key={index} className="collaborator-item">
                <FaUserAlt className="icon" /> {user}
                <button
                  onClick={() => handleRemoveCollaborator(user)}
                  className="remove-button"
                >
                  <FaTimes className="icon" /> Remove
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">No collaborators added</p>
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Approval</h3>
        <div className="approval-list">
          <button className="approval-button">
            <FaCheckCircle className="icon" /> Approve Request 1
          </button>
          <button className="approval-button">
            <FaCheckCircle className="icon" /> Approve Request 2
          </button>
          <button className="approval-button">
            <FaCheckCircle className="icon" /> Approve Request 3
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Training</h3>
        <div className="training-list">
          <button className="training-button">
            <FaChalkboardTeacher className="icon" /> Training Module 1
          </button>
          <button className="training-button">
            <FaChalkboardTeacher className="icon" /> Training Module 2
          </button>
          <button className="training-button">
            <FaChalkboardTeacher className="icon" /> Training Module 3
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
