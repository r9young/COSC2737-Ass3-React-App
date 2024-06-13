import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://3.27.231.121:4000'); // Ensure this matches your server URL and port

const App = () => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId] = useState('60d0fe4f5311236168a109cb'); // Replace with the actual logged-in user ID

  useEffect(() => {
    // Fetch users
    axios.get('http://3.27.231.121:4000/getUser')
      .then(response => {
        console.log('Users fetched:', response.data); // Debug log
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Fetch conversations
    axios.get('http://3.27.231.121:4000/api/conversations')
      .then(response => {
        console.log('Conversations fetched:', response.data); // Debug log
        setConversations(response.data.conversations);
      })
      .catch(error => {
        console.error('Error fetching conversations:', error);
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
  }, []);

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
        setSelectedConversation(conversationId);
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

    axios.post(`http://3.27.231.121:4000/api/conversations/${selectedConversation}/messages`, newMessage)
      .then(() => {
        socket.emit('sendMessage', {
          conversationId: selectedConversation,
          ...newMessage
        });
        setMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  const selectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    socket.emit('joinRoom', conversationId);
    fetchMessages(conversationId);
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id} onClick={() => selectUser(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Conversations</h2>
        <ul>
          {conversations.map(conv => (
            <li key={conv._id} onClick={() => selectConversation(conv._id)}>
              Conversation with {conv.participants.filter(p => p !== userId).map(p => getUserById(p)).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Chat</h2>
        {selectedConversation && (
          <>
            <div>
              {messages.map((msg, index) => (
                <p key={index}><strong>{getUserById(msg.senderId)}</strong>: {msg.text}</p>
              ))}
            </div>
            <div>
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
  );
};

export default App;
