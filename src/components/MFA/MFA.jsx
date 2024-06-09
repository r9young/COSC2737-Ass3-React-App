import React, { useState } from 'react';

const EnableMFA = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const enableMFA = async () => {
    try {
      const response = await fetch('http://13.54.65.192:4000/enable-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: '60d0fe4f5311236168a109ca' }), // Use a valid userId
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
      <button onClick={enableMFA}>Enable MFA</button>
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
    </div>
  );
};

export default EnableMFA;
