// src/components/InputBox.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './InputBox.css';

const InputBox = forwardRef((props, ref) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false); // To show loading state

  const handleSend = () => {
    if (input.trim()) {
      setIsSending(true);
      props.onSubmit(input);
      setInput('');
      setTimeout(() => setIsSending(false), 1000); // Simulate a sending delay
    }
  };

  useImperativeHandle(ref, () => ({
    handleSend
  }));

  return (
    <div className="input-box">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        aria-label="Message input" // Accessibility improvement
        disabled={isSending} // Disable input while sending
      />
      <button onClick={handleSend} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
});

export default InputBox;
