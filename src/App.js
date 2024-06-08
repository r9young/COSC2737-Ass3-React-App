import React, { useState } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', loginData);
      if (response.data.success) {
        navigate('/chat');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred during login');
    }
  };

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
              <button className="button">
                <label className="primary" htmlFor="input-1">
                  Reset Forget Password
                </label>
              </button>
            </form>
          </div>
        )}
        {location.pathname !== '/' && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        )}
        <div className="text-wrapper-4">Welcome to Easy Chat</div>
      </div>
    </div>
  );
}

export default App;
