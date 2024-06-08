import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register/Register';
import Contact from './components/Contact';

function App() {
  const location = useLocation();

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
            <div className="input-and-button">
              <input className="field" id="input-1" placeholder="username" type="username" />
              <input className="field" id="input-2" placeholder="password" type="password" />
              <button className="button">
                <label className="primary" htmlFor="input-1">
                  Sign in with email
                </label>
              </button>
              <button className="button">
                <label className="primary" htmlFor="input-1">
                  Reset Forget Password
                </label>
              </button>
            </div>
          </div>
        )}
        {location.pathname !== '/' && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        )}
        <div className="text-wrapper-4">Welcome to Easy Chat</div>
      </div>
    </div>
  );
}

export default App;
