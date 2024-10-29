import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './InputBox.css';

const InputBox = forwardRef((props, ref) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      setIsSending(true);
      props.onSubmit(input);
      setInput('');
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  const handleAddSymbol = () => {
    // Define what the "+" button should do, e.g., add a "+" symbol to the input
    setInput((prev) => `${prev} +`);
  };

  useImperativeHandle(ref, () => ({
    handleSend,
    handleAddSymbol,
  }));

  return (
    <div className="input-box">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        aria-label="Message input"
        disabled={isSending}
      />
      <button onClick={handleSend} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
});

export default InputBox;
