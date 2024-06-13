// src/components/OTPInput/OTPInput.js
import React, { useState } from 'react';

function OTPInput({ onSubmit }) {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    onSubmit(otp);
  };

  return (
    <div>
      <form onSubmit={handleOtpSubmit}>
        <label htmlFor="otp">Enter OTP:</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={handleOtpChange}
        />
        <button type="submit">Submit OTP</button>
      </form>
    </div>
  );
}

export default OTPInput;
