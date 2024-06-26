import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatWindow.css';
import { FaFacebookMessenger } from 'react-icons/fa';

const ChatWindow = ({ selected, user, reponame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [fileName, setFileName] = useState(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL, { transports: ['websocket'] });
    setSocket(newSocket);
    const getResponse = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/repo/${user}/${reponame}/name/${selected}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      const name = await response.json();
      setFileName(name.name);
      setMessages(['context set to ' + name.name]);
    };
    getResponse();
    newSocket.on('response', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      if (newSocket.readyState === 1) newSocket.disconnect();
    };
  }, [selected]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket) {
      // Send the message to the server
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(
        'sending to server',
        message + '.@.@.' + user + '#' + reponame + '.@.@.' + fileName
      );
      socket.emit('message', message + '.@.@.' + user + '#' + reponame + '.@.@.' + fileName);
      setMessage('');
      event.target.reset();
    }
  };

  return (
    <>
      <FaFacebookMessenger onClick={toggleChat} id="chat-circle" />

      <div class="chat-box">
        {isOpen && (
          <>
            <div class="chat-box-header">
              <span>CodeGPT</span>
              <span class="chat-box-toggle" onClick={toggleChat}>
                <i class="material-icons">x</i>
              </span>
            </div>
            <div class="chat-box-body">
              <div class="chat-box-overlay"></div>
              <div class="chat-logs">
                {messages.map((message, index) => (
                  <div
                    key={`server-${index}`}
                    id={`cm-msg-${index}`}
                    class={`chat-msg ${index % 2 === 0 ? 'user' : 'self'}`}
                  >
                    <div class="cm-msg-text">{message}</div>
                  </div>
                ))}
              </div>
            </div>
            <div class="chat-input">
              <form class="chat-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="chat-input"
                  placeholder="Send a message..."
                  onChange={handleMessageChange}
                />
                <button type="submit" class="chat-submit" id="chat-submit">
                  <h3>send</h3>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatWindow;
