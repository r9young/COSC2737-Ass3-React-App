import React, { useState } from 'react';

const Mfa = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const enableMfa = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://13.54.65.192:4000/enable-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();
      if (result.qrCodeUrl) {
        setQrCodeUrl(result.qrCodeUrl);
      } else {
        alert('Failed to generate QR code. Please try again.');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('An error occurred while generating the QR code.');
    }
  };

  return (
    <div>
      <h1>Enable MFA</h1>
      <button onClick={enableMfa}>Enable MFA</button>
      {qrCodeUrl && (
        <div id="qrCodeContainer">
          <p>Scan this QR code with your Google Authenticator app:</p>
          <img id="qrCodeImage" src={qrCodeUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default Mfa;
