import React, { useState } from 'react';

const EnableMFA = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  const enableMFA = async () => {
    try {
      const response = await fetch('http://3.27.231.121:4000/enable-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Use the dynamic userId
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
    } catch (error) {
      console.error('Error enabling MFA:', error.message);
    }
  };

  return (
    <div>
      <button onClick={enableMFA} disabled={!userId}>Enable MFA</button>
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
    </div>
  );
};

export default EnableMFA;
