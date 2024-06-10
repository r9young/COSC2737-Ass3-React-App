import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './style.css'; // Ensure the path is correct
import axios from 'axios';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);

  const userId = localStorage.getItem('userId'); // Get logged-in user's ID

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not set in localStorage');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://13.54.65.192:4000/getUser');
        console.log('Users fetched:', response.data); // Debugging line
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [userId]);

  const startConversation = async (user) => {
    console.log('User clicked:', user); // Log the clicked user
    if (!userId || !user._id) {
      console.error('User ID is null');
      return;
    }
    console.log('Starting conversation with:', user);
    setSelectedUser(user);
    try {
      const response = await axios.post('http://13.54.65.192:4000/api/conversations', {
        participants: [userId, user._id]
      });
      setConversationId(response.data.conversationId);
      fetchMessages(response.data.conversationId);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://13.54.65.192:4000/api/conversations/${conversationId}/messages`);
      console.log('Messages fetched:', response.data.messages); // Debugging line
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`http://13.54.65.192:4000/api/conversations/${conversationId}/messages`, {
        senderId: userId,
        text: newMessage
      });
      fetchMessages(conversationId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <p className="list-title">Friend's List</p>
        {users.map((user) => (
          <div
            key={user._id}
            className="user-item"
            onClick={() => startConversation(user)}
          >
            {user.firstname} {user.lastname}
          </div>
        ))}
        <div className="mfa-button">
          <Link to="/mfa">
            <button>
              Enable MFA
            </button>
          </Link>
        </div>
      </div>
      <div className="conversation-window">
        <div className="conversation-header">
          <p className="header-title">You are currently talking to:</p>
          {selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : 'Select a user to chat'}
        </div>
        <div className="conversation-content">
          {messages.map((msg, index) => (
            <div key={index} className={msg.senderId === userId ? 'my-message' : 'their-message'}>
              <div>{msg.senderId === userId ? 'You' : selectedUser ? selectedUser.firstname : 'Unknown'}</div>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="conversation-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
