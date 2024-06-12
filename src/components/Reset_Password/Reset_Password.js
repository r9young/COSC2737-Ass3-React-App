import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reset_Password.css'; // Import the CSS file

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const base_url = process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_LOCAL_BASE_URL
    : process.env.REACT_APP_SERVER_BASE_URL;

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${base_url.replace(/\/$/, "")}/reset-password`, { password, token });
      console.log('Password reset response:', response.data);
      setMessage('Password has been reset successfully');
      navigate('/login'); // Redirect to login page after successful reset
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="password-container">
      <h1>Password Reset</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        {message && <p>{message}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PasswordReset;
// 