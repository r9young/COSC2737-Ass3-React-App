import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import { io } from 'socket.io-client';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [userDetails, setUserDetails] = useState({ _id: '', firstname: '', lastname: '' });

  const username = localStorage.getItem('username');
  const socketRef = useRef();

  useEffect(() => {
    if (!username) {
      console.error('Username is not set in localStorage');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://13.54.65.192:4000/getUserByUsername/${username}`);
        console.log('User details fetched:', response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://13.54.65.192:4000/getUser');
        console.log('Users fetched:', response.data);
        // Filter out the current user from the list of users
        const filteredUsers = response.data.filter(user => user.username !== username);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUserDetails();
    fetchUsers();

    socketRef.current = io('http://13.54.65.192:4000');

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  const startConversation = async (user) => {
    console.log('User clicked:', user);
    const userId = userDetails._id;
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
      const newConversationId = response.data.conversationId;
      setConversationId(newConversationId);
      fetchMessages(newConversationId);
      socketRef.current.emit('joinRoom', newConversationId);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://13.54.65.192:4000/api/conversations/${conversationId}/messages`);
      console.log('Messages fetched:', response.data.messages);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!conversationId) {
      console.error('Conversation ID is null');
      return;
    }

    try {
      await axios.post(`http://13.54.65.192:4000/api/conversations/${conversationId}/messages`, {
        senderId: userDetails._id,
        text: newMessage
      });
      socketRef.current.emit('sendMessage', { conversationId, senderId: userDetails._id, text: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Welcome, {userDetails.firstname} {userDetails.lastname}!</h2>
      </div>
      <div className="main-content">
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
              <div key={index} className={msg.senderId === userDetails._id ? 'my-message' : 'their-message'}>
                <div>{msg.senderId === userDetails._id ? 'You' : selectedUser ? selectedUser.firstname : 'Unknown'}</div>
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
    </div>
  );
};

export default Chat;

