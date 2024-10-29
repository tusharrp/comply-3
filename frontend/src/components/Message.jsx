// src/components/Message.jsx
import React from 'react';
import './Message.css';

const Message = ({ message }) => {
  const { text, sender, timestamp } = message;
  const messageClass = sender === 'bot' ? 'bot-message' : 'user-message';

  return (
    <div className={`message-wrapper ${messageClass}`}>
      {sender === 'bot' && (
        <img 
          src="/bot-avatar.png"  // Replace with your bot avatar path
          alt="Bot Avatar" 
          className="avatar"
        />
      )}
      <div className="message-content">
        <p className="message-text">{text}</p>
        <span className="timestamp">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {sender !== 'bot' && (
        <img 
          src="/user-avatar.png"  // Replace with user avatar path
          alt="User Avatar" 
          className="avatar"
        />
      )}
    </div>
  );
};

export default Message;
