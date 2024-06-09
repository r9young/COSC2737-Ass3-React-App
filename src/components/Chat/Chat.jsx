import React from 'react';
import './style.css'; // Ensure the path is correct

export const Chat = () => {
  const enableMfa = async () => {
    const userId = localStorage.getItem('userId');
    const response = await fetch('/enable-mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const result = await response.json();
    if (result.qrCodeUrl) {
      document.getElementById('qrCodeImage').src = result.qrCodeUrl;
      document.getElementById('qrCodeContainer').style.display = 'block';
    } else {
      alert('Failed to generate QR code. Please try again.');
    }
  };

  return (
    <div className="chat">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="baground">
            <div className="div" />
          </div>
          <div className="sebalah-kiri">
            <div className="text-wrapper">Tom</div>
            <div className="text-wrapper-2">Smith</div>
            <div className="text-wrapper-3">Mary</div>
            <div className="text-wrapper-10">Recent Conversation</div>
            <div className="overlap-group">
            </div>
            <div className="line-wrapper">
            </div>
            <div className="text-wrapper-12">John</div>
            <div className="rectangle-3" />
          </div>
          <div className="sebelah-kanan">
            <div className="overlap-2">
              <div className="text-wrapper-15">John</div>
            </div>
            <div className="smile-wrapper">
              {/* Uncomment the Smile import line in your actual code */}
              {/* <Smile className="smile-instance" /> */}
            </div>
          </div>
          <div className="buble-chat">
            <div className="text-wrapper-16">Cathy</div>
            <p className="i-ask-again-if">
              I ask again if
            </p>
          </div>
          <div className="isi-chat">
            {/* Uncomment the HomeHomeAltOutline1 import line in your actual code */}
            {/* <HomeHomeAltOutline1 className="home-home-alt" /> */}
            {/* <div className="text-wrapper-19">Switch Account</div> */}
            <button className="text-wrapper-19" id="enableMfaBtn" onClick={enableMfa}>Enable MFA</button>
            <div className="overlap-3">
              {/* Uncomment the FileFolderOpen1 import line in your actual code */}
              {/* <FileFolderOpen1 className="file-folder-open" /> */}
              <div className="text-wrapper-20">Friend List</div>
            </div>
            {/* <CommunicationMessageCircle1 className="communication" /> */}
            {/* Uncomment the BrandApple1 import line in your actual code */}
            {/* <BrandApple1 className="brand-apple" /> */}
            <div className="text-wrapper-21">CHAT</div>
            {/* <div className="rectangle-4" /> */}
          </div>
        </div>
      </div>
      <div id="qrCodeContainer" style={{ display: 'none' }}>
        <p>Scan this QR code with your Google Authenticator app:</p>
        <img id="qrCodeImage" alt="QR Code" />
      </div>
    </div>
  );
};

export default Chat;
