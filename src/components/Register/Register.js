import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import the CSS file

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password'
          ? value === formData.confirmPassword
          : value === formData.password
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const { confirmPassword, ...dataToSubmit } = formData;
    try {
      await axios.post('/your-endpoint', dataToSubmit);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      alert('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Some error occurred');
    }
  };

  return (
    <div className="register">
      <div className="content">
        <h1 className="text-wrapper">Register Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-and-button">
            <input
              className="field"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              className="field"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              className="field"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              className="field"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <input
              className="field"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            {!passwordMatch && (
              <p className="error-message">Passwords do not match!</p>
            )}
            <button className="button" type="submit">
              <span className="button-primary">Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
