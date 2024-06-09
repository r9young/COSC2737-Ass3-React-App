import React from 'react';
import './style.css'; // Ensure the path is correct
import { Link } from 'react-router-dom';

const Chat = () => {
  return (
    <div className="chat">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="background">
            <div className="div" />
          </div>
          <div className="sebalah-kiri">
            <div className="text-wrapper">Tom</div>
            <div className="text-wrapper-2">Smith</div>
            <div className="text-wrapper-3">Mary</div>
            <div className="text-wrapper-10">Recent Conversation</div>
            <div className="overlap-group"></div>
            <div className="line-wrapper"></div>
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
            <p className="i-ask-again-if">I ask again if</p>
          </div>
          <div className="isi-chat">
            <div className="input-and-button">
              <Link to="/mfa">
                <button className="button">
                  <label className="primary" htmlFor="input-1">
                    Enable MFA
                  </label>
                </button>
              </Link>
            </div>
            <div className="overlap-3">
              <div className="text-wrapper-20">Friend List</div>
            </div>
            <div className="text-wrapper-21">CHAT</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
