import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatWindow = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create a new Socket.IO client instance and connect to the server
    const newSocket = io('http://localhost:3000', { transports: ['websocket'] });
    setSocket(newSocket);

    // Listen for incoming messages from the server
    newSocket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket) {
      // Send the message to the server
      console.log('sending to server', message);
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleMessageChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
