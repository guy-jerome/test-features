import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const TextBox = () => {
  const [content, setContent] = useState('');
  const socket = io('http://localhost:3000'); // Replace with your server URL

  useEffect(() => {
    // Connect on component mount
    socket.on('content-change', (data) => {
      setContent(data); // Update state from incoming changes
    });
  }, []);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    socket.emit('content-change', newContent); // Emit change to server
  };

  return (
    <textarea
      value={content}
      onChange={(e) => handleContentChange(e.target.value)}
    />
  );
};

export default TextBox;