import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const base_url = process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_LOCAL_BASE_URL
    : process.env.REACT_APP_SERVER_BASE_URL;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${base_url.replace(/\/$/, "")}/password-reset-request`, { username });
      console.log('Password reset request response:', response.data); // Log the server response
      setMessage('If this username is registered, you will receive a password reset link.');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="password-reset-request">
      <h1>Password Reset Request</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <button type="submit">Request Password Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;
