import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import MFA from './components/MFA/MFA';
import OTPInput from './components/OTPInput/OTPInput';
import PasswordResetRequest from './components/PassReqRest/PassReqRest';
import PasswordReset from './components/Reset_Password/Reset_Password';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [mfaSecret, setMfaSecret] = useState(null);

  const base_url = process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_LOCAL_BASE_URL
    : process.env.REACT_APP_SERVER_BASE_URL;

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${base_url.replace(/\/$/, "")}/api/login`, loginData);
      console.log('Login response:', response.data); // Log the server response
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId); // Store the userId
        localStorage.setItem('username', loginData.username); // Store the username
        setMfaSecret(response.data.mfaSecret || null); // Set MFA secret if available
        console.log('MFA Secret:', response.data.mfaSecret); // Log MFA secret
        if (!response.data.mfaSecret) {
          navigate('/chat'); // Redirect to the chat page if MFA is not required
        }
      } else {
        setLoginError('Invalid username or password'); // Display error message if login fails
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred during login'); // Display error message if there is an issue with the request
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await axios.post(`${base_url.replace(/\/$/, "")}/api/verify-otp`, {
        otp,
        userId: localStorage.getItem('userId')
      });
      console.log('OTP response:', response.data); // Log the OTP verification response
      if (response.data.success) {
        navigate('/chat'); // Redirect to chat page after successful OTP verification
      } else {
        setLoginError('Invalid OTP'); // Display error message if OTP verification fails
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setLoginError('An error occurred during OTP verification'); // Display error message if there is an issue with the request
    }
  };

  useEffect(() => {
    console.log('Current MFA Secret state:', mfaSecret);
  }, [mfaSecret]);

  return (
    <div className="auth">
      <div className="div">
        {location.pathname === '/' && (
          <div className="content">
            <div className="copy">
              <div className="divider">
                <div className="rectangle" />
                <div className="text-wrapper">Create a New Account</div>
                <div className="rectangle" />
              </div>
            </div>
            <div className="input-and-button">
              <Link to="/register">
                <button className="button">
                  <label className="primary" htmlFor="input-1">
                    Sign Up Your Account Here
                  </label>
                </button>
              </Link>
            </div>
            <div className="divider">
              <div className="rectangle" />
              <div className="text-wrapper">Sign In</div>
              <div className="rectangle" />
            </div>
            {!mfaSecret ? (
              <form onSubmit={handleLoginSubmit} className="input-and-button">
                <input
                  className="field"
                  id="input-1"
                  placeholder="username"
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
                <input
                  className="field"
                  id="input-2"
                  placeholder="password"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                <button className="button" type="submit">
                  <label className="primary" htmlFor="input-1">
                    Sign In
                  </label>
                </button>
                <Link to="/password-reset-request">
                  <button className="button" type="button">
                    <label className="primary" htmlFor="input-1">
                      Reset Forget Password
                    </label>
                  </button>
                </Link>
              </form>
            ) : (
              <OTPInput onSubmit={handleOtpSubmit} />
            )}
          </div>
        )}
        {location.pathname !== '/' && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/MFA" element={<MFA />} />
            <Route path="/password-reset-request" element={<PasswordResetRequest />} /> {/* Add the new route */}
            <Route path="/reset-password" element={<PasswordReset />} /> {/* Add the new route */}
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
