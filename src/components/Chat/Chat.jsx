import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './Chat.css'; // Ensure you have this CSS file imported

const socket = io('http://3.27.231.121:4000'); // Ensure this matches your server URL and port

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId] = useState('60d0fe4f5311236168a109cb'); // Replace with the actual logged-in user ID
  const [username, setUsername] = useState(''); // State for the username
  const navigate = useNavigate(); // Use the navigate hook

  useEffect(() => {
    // Fetch users
    axios.get('http://3.27.231.121:4000/getUser')
      .then(response => {
        console.log('Users fetched:', response.data); // Debug log
        setUsers(response.data);

        // Assuming the user ID is unique and we can find the username from the fetched users
        const currentUser = response.data.find(user => user._id === userId);
        setUsername(currentUser ? currentUser.username : 'Unknown User');
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Socket event listeners
    socket.on('newMessage', (newMessage) => {
      console.log('New message received:', newMessage); // Debug log
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    socket.on('messages', (fetchedMessages) => {
      console.log('Fetched messages:', fetchedMessages); // Debug log
      setMessages(fetchedMessages);
    });

    return () => {
      socket.off('newMessage');
      socket.off('messages');
    };
  }, [userId]);

  const getUserById = (id) => {
    const user = users.find(user => user._id === id);
    return user ? user.username : 'Unknown User';
  };

  const selectUser = (user) => {
    console.log('User selected:', user); // Debug log
    // Create or fetch conversation with the selected user
    axios.post('http://3.27.231.121:4000/api/conversations', { participants: [userId, user._id] })
      .then(response => {
        const conversationId = response.data.conversationId;
        setSelectedConversation({ _id: conversationId, participants: [userId, user._id] });
        socket.emit('joinRoom', conversationId);
        fetchMessages(conversationId);
      })
      .catch(error => {
        console.error('Error creating/fetching conversation:', error);
      });
  };

  const fetchMessages = (conversationId) => {
    axios.get(`http://3.27.231.121:4000/api/conversations/${conversationId}/messages`)
      .then(response => {
        console.log('Messages fetched:', response.data.messages); // Debug log
        setMessages(response.data.messages);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  };

  const sendMessage = () => {
    if (!selectedConversation) {
      console.error('No conversation selected');
      return;
    }

    const newMessage = {
      senderId: userId,
      text: message
    };

    axios.post(`http://3.27.231.121:4000/api/conversations/${selectedConversation._id}/messages`, newMessage)
      .then(() => {
        socket.emit('sendMessage', {
          conversationId: selectedConversation._id,
          ...newMessage
        });
        setMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  const handleEnableMFA = () => {
    navigate('/mfa');
  };

  return (
    <div className="app-container">
      <h1 className="heading">Easy Chat</h1>
      <div className="username-display">
        <p>Logged in as: {username}</p>
      </div>
      <div className="users-chat">
        <div className="users-list">
          <h2 className="heading">Users</h2>
          <ul>
            {users.map(user => (
              <li
                key={user._id}
                className={selectedConversation && selectedConversation.participants.includes(user._id) ? 'selected' : ''}
                onClick={() => selectUser(user)}
              >
                {user.username}
              </li>
            ))}
          </ul>
          <button onClick={handleEnableMFA} className="mfa-button">Enable MFA</button>
        </div>
        <div className="chat-container">
          <h2>Chat</h2>
          {selectedConversation && (
            <>
              <div className="messages-box">
                {messages.map((msg, index) => (
                  <p key={index}><strong>{getUserById(msg.senderId)}</strong>: {msg.text}</p>
                ))}
              </div>
              <div className="input-box">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
