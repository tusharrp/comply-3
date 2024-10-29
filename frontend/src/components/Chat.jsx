// src/components/Chat.jsx
import React, { useRef, useState } from 'react';
import InputBox from './InputBox';
import Message from './Message';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  const handleSubmit = (text) => {
    const newMessage = { text, sender: 'user', timestamp: Date.now() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    inputRef.current.handleSend(); // Clear input after sending
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <InputBox ref={inputRef} onSubmit={handleSubmit} />
    </div>
  );
};

export default Chat;
