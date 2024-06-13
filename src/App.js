import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
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
  const [loginData, setLoginData] = useState({ username: '', password: '' });
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
      console.log('Login response:', response.data);
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', loginData.username);
        setMfaSecret(response.data.mfaSecret || null);
        console.log('MFA Secret:', response.data.mfaSecret);
        if (!response.data.mfaSecret) {
          navigate('/chat');
        }
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred during login');
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await axios.post(`${base_url.replace(/\/$/, "")}/api/verify-otp`, {
        otp,
        userId: localStorage.getItem('userId')
      });
      console.log('OTP response:', response.data);
      if (response.data.success) {
        navigate('/chat');
      } else {
        setLoginError('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setLoginError('An error occurred during OTP verification');
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
                <div className="text-wrapper">Welcome to Easy Talk</div>
                <div className="rectangle" />
              </div>
            </div>
            <div className="copy">
              <div className="divider">
                <div className="rectangle" />
                <div className="text-wrapper">Create a New Account</div>
                <div className="rectangle" />
              </div>
            </div>
            <div className="input-and-button">
              <Link to="/register">
                <button clas sName="button">
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
            <Route path="/password-reset-request" element={<PasswordResetRequest />} />
            <Route path="/reset-password" element={<PasswordReset />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;


