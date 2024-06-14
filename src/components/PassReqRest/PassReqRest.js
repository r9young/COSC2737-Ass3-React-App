import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PassReqRest.css';

const PasswordResetRequest = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
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
          placeholder="enter email address"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <button type="submit">Request Password Reset</button>
      </form>
      {message && <p>{message}</p>}
      <a href="https://mailtrap.io/" target="_blank" rel="noopener noreferrer">Link for MailTrap</a>
      <button onClick={() => navigate('/reset-password')}>Go to Reset Password</button>
      <p>For testing purposes, I used the mail testing function in Mailtrap. I have included the username and password in my report.</p>
    </div>
  );
};

export default PasswordResetRequest;
