import React, { useState, useRef, useEffect } from "react";
import Icon from "@/components/icon/Icon";
import { 
  DropdownToggle, 
  DropdownMenu, 
  UncontrolledDropdown,
  Modal,
  ModalBody
} from "reactstrap";
import { Phone, X, Mic, MicOff, Volume2, Minimize2, ChevronDown } from "lucide-react";

const Dialer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isDialerMinimized, setIsDialerMinimized] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const timerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('');
  
  // Set current time for iPhone status bar - updates every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      setCurrentTime(
        `${hours > 12 ? hours - 12 : hours === 0 ? 12 : hours}:${minutes.toString().padStart(2, '0')}`
      );
      
      // Simulate battery draining when call is active
      if (callActive && seconds % 30 === 0) {
        setBatteryLevel(prev => Math.max(prev - 1, 5));
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [callActive]);
  
  // Toggle the dialer modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen && callActive) {
      handleEndCall();
    }
  };
  
  // Handle number input
  const handleNumberInput = (num) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(prevNumber => prevNumber + num);
    }
  };
  
  // Handle backspace
  const handleBackspace = () => {
    setPhoneNumber(prevNumber => prevNumber.slice(0, -1));
  };
  
  // Format phone number for display
  const formatPhoneNumber = (number) => {
    if (!number) return "";
    
    // Remove non-numeric characters
    const cleaned = number.replace(/\D/g, "");
    
    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };
  
  // Handle call button
  const handleCall = () => {
    if (phoneNumber.length > 0) {
      setCallActive(true);
      // Start timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
  };
  
  // Handle end call
  const handleEndCall = () => {
    setCallActive(false);
    clearInterval(timerRef.current);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsDialerMinimized(false);
  };
  
  // Toggle mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle speaker
  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };
  
  // Toggle dialer minimization
  const toggleDialerSize = () => {
    setIsDialerMinimized(!isDialerMinimized);
  };
  
  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Dialer buttons
  const dialerButtons = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' }
  ];

  return (
    <>
      <UncontrolledDropdown className="user-dropdown">
        <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon" onClick={toggleModal}>
          <div className="icon-status icon-status-na">
            <Phone size={20} />
          </div>
        </DropdownToggle>
      </UncontrolledDropdown>
      
      {/* iPhone Style Dialer Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} className="dialer-modal" centered size="sm">
        <ModalBody className="p-0">
          <div className="iphone-frame iphone16-pro">
            {/* iPhone Dynamic Island */}
            <div className="dynamic-island">
              <div className="island-container">
                <div className="island"></div>
              </div>
            </div>
            
            {/* iPhone Status Bar */}
            <div className="iphone-status-bar">
              <div className="status-left">{currentTime}</div>
              <div className="status-right">
                <span className="signal-icon">
                  <div className="signal-bars">
                    <div className="signal-bar"></div>
                    <div className="signal-bar"></div>
                    <div className="signal-bar"></div>
                    <div className="signal-bar"></div>
                  </div>
                </span>
               
                <span className="battery-icon">
                  <div className="battery-container">
                    <div className="battery-level" style={{ width: `${batteryLevel}%` }}></div>
                    <div className="battery-text">{batteryLevel}%</div>
                  </div>
                </span>
              </div>
            </div>
            
            {/* iPhone Dialer App */}
            <div className="iphone-app">
             
              
              {/* Dialer container */}
              <div className={`dialer-container ${callActive && isDialerMinimized ? 'minimized' : ''}`}>
                {callActive && isDialerMinimized ? (
                  <div className="minimized-call-screen" onClick={toggleDialerSize}>
                    <div className="call-bubble">
                      <div className="call-info-mini">
                        <div className="call-icon-mini">
                          <Phone size={16} color="white" />
                        </div>
                        <div className="call-details-mini">
                          <div className="call-number-mini">{formatPhoneNumber(phoneNumber)}</div>
                          <div className="call-timer-mini">{formatDuration(callDuration)}</div>
                        </div>
                      </div>
                      <button className="end-call-btn-mini" onClick={(e) => {
                        e.stopPropagation();
                        handleEndCall();
                      }}>
                        <X size={14} color="white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header with phone number display */}
                    <div className="dialer-header">
                      {callActive ? (
                        <div className="call-active">
                          <div className="call-avatar">
                            <div className="avatar-circle">
                              <div className="avatar-initial">{phoneNumber.charAt(0) || "?"}</div>
                            </div>
                          </div>
                          <div className="call-number">{formatPhoneNumber(phoneNumber)}</div>
                          <div className="call-timer">{formatDuration(callDuration)}</div>
                        </div>
                      ) : (
                        <div className="phone-number">
                          {formatPhoneNumber(phoneNumber) || ""}
                        </div>
                      )}
                      
                      {/* Backspace button */}
                      {!callActive && phoneNumber && (
                        <button 
                          className="backspace-btn" 
                          onClick={handleBackspace}
                          aria-label="Delete"
                        >
                          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <path d="M22 0H7C6.31 0 5.77 0.35 5.41 0.88L0 9L5.41 17.11C5.77 17.64 6.31 18 7 18H22C23.1 18 24 17.1 24 16V2C24 0.9 23.1 0 22 0ZM19 12.59L17.59 14L14 10.41L10.41 14L9 12.59L12.59 9L9 5.41L10.41 4L14 7.59L17.59 4L19 5.41L15.41 9L19 12.59Z" fill="#8E8E93"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Dialer keypad */}
                    {!callActive && (
                      <div className="dialer-keypad">
                        <div className="keypad-grid">
                          {dialerButtons.map((button, index) => (
                            <button 
                              key={index}
                              className="keypad-button"
                              onClick={() => handleNumberInput(button.num)}
                            >
                              <span className="number">{button.num}</span>
                              {button.sub && <span className="sub-text">{button.sub}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Call controls */}
                    <div className="call-controls">
                      {callActive ? (
                        <>
                          <div className="call-actions">
                            <button 
                              className={`action-btn ${isMuted ? 'active' : ''}`} 
                              onClick={handleToggleMute}
                            >
                              <div className="action-icon">
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                              </div>
                              <span>Mute</span>
                            </button>
                            <button 
                              className={`action-btn ${isSpeakerOn ? 'active' : ''}`} 
                              onClick={handleToggleSpeaker}
                            >
                              <div className="action-icon">
                                <Volume2 size={24} />
                              </div>
                              <span>Speaker</span>
                            </button>
                            <button 
                              className="action-btn" 
                              onClick={toggleDialerSize}
                            >
                              <div className="action-icon">
                                <Minimize2 size={24} />
                              </div>
                              <span>Minimize</span>
                            </button>
                          </div>
                          <button className="end-call-btn" onClick={handleEndCall}>
                          <Phone size={24} />
                          </button>
                        </>
                      ) : (
                        <>
                          {phoneNumber && (
                            <button 
                              className="call-btn"
                              onClick={handleCall}
                              aria-label="Call"
                            >
                              <Phone size={24} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              
            </div>
            
            {/* iPhone Home Indicator */}
            <div className="home-indicator">
              <div className="indicator"></div>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* CSS Styles for the iPhone Frame and Dialer */}
      <style jsx>{`
        /* iPhone Frame */
        .iphone-frame {
          background-color: #f2f2f7;
          border-radius: 40px;
          border: 10px solid #000;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          height: 640px;
          overflow: hidden;
          position: relative;
          width: 300px;
          margin: 0 auto;
        }
        
        /* iPhone 16 Pro specific styles */
        .iphone16-pro {
          border-color: #1c1c1e;
          background-color: #f5f5f7;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.5);
        }
        
        /* Dynamic Island */
        .dynamic-island {
          height: 34px;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 10;
          display: flex;
          justify-content: center;
        }
        
        .island-container {
          display: flex;
          justify-content: center;
        }
        
        .island {
          background-color: #000;
          border-radius: 20px;
          height: 34px;
          width: 126px;
          margin-top: -4px;
        }
        
        /* Status Bar */
        .iphone-status-bar {
          background-color: transparent;
          display: flex;
          height: 44px;
          justify-content: space-between;
          padding: 12px 20px 0;
          position: relative;
          width: 100%;
          z-index: 5;
        }
        
        .status-left {
          font-size: 14px;
          font-weight: 600;
        }
        
        .status-right {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        
        .signal-icon, .wifi-icon, .battery-icon {
          display: flex;
          align-items: center;
        }
        
        .signal-bars {
          display: flex;
          align-items: flex-end;
          height: 12px;
        }
        
        .signal-bar {
          background-color: #000;
          width: 3px;
          margin-right: 1px;
          border-radius: 1px;
        }
        
        .signal-bar:nth-child(1) { height: 5px; }
        .signal-bar:nth-child(2) { height: 7px; }
        .signal-bar:nth-child(3) { height: 9px; }
        .signal-bar:nth-child(4) { height: 11px; }
        
        .network-type {
          font-size: 12px;
          font-weight: 600;
          margin-right: 4px;
        }
        
        .battery-container {
          display: flex;
          align-items: center;
          border: 1.5px solid #000;
          border-radius: 3px;
          width: 24px;
          height: 12px;
          padding: 1px;
          position: relative;
        }
        
        .battery-container:after {
          content: '';
          position: absolute;
          right: -3px;
          top: 3px;
          width: 2px;
          height: 4px;
          background: #000;
          border-radius: 0 1px 1px 0;
        }
        
        .battery-level {
          background-color: #000;
          height: 100%;
          border-radius: 1px;
        }
        
        .battery-text {
          position: absolute;
          left: 26px;
          font-size: 10px;
          font-weight: 600;
        }
        
        /* iPhone App */
        .iphone-app {
          background-color: #f2f2f7;
          height: calc(100% - 90px);
          overflow: hidden;
          position: relative;
        }
        
        .app-header {
          align-items: center;
          display: flex;
          height: 44px;
          justify-content: space-between;
          padding: 0 16px;
        }
        
        .header-title {
          font-size: 17px;
          font-weight: 600;
        }
        
        .header-left, .header-right {
          color: #007aff;
          font-size: 14px;
          min-width: 44px;
        }
        
        .call-indicator {
          display: flex;
          align-items: center;
          color: #FF3B30;
          font-size: 12px;
          font-weight: 600;
        }
        
        /* Dialer */
        .dialer-container {
          padding: 10px;
          height: calc(100% - 104px);
          transition: all 0.3s ease;
        }
        
        .dialer-container.minimized {
          height: 60px;
          padding: 0;
          position: absolute;
          right: 10px;
          top: 50px;
          width: 200px;
          z-index: 100;
        }
        
        .minimized-call-screen {
          height: 100%;
          width: 100%;
        }
        
        .call-bubble {
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 16px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          height: 100%;
          width: 100%;
          backdrop-filter: blur(10px);
        }
        
        .call-info-mini {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .call-icon-mini {
          background-color: #34C759;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .call-details-mini {
          display: flex;
          flex-direction: column;
        }
        
        .call-number-mini {
          font-size: 13px;
          font-weight: 500;
        }
        
        .call-timer-mini {
          font-size: 11px;
          opacity: 0.8;
        }
        
        .end-call-btn-mini {
          background-color: #ff3b30;
          border: none;
          border-radius: 50%;
          height: 24px;
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
        }
        
        .dialer-header {
          padding: 20px 10px;
          text-align: center;
          position: relative;
        }
        
        .phone-number {
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          min-height: 40px;
        }
        
        .backspace-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #8E8E93;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .call-active {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 0;
        }
        
        .call-avatar {
          margin-bottom: 15px;
        }
        
        .avatar-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #007AFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: 500;
        }
        
        .avatar-initial {
          text-transform: uppercase;
        }
        
        .call-number {
          font-size: 22px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .call-timer {
          font-size: 16px;
          color: #8E8E93;
          font-weight: 400;
        }
        
        .dialer-keypad {
          margin: 0 auto;
          width: 100%;
        }
        
        .keypad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        
        .keypad-button {
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          height: 65px;
          width: 65px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s;
        }
        
        .keypad-button:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }
        
        .keypad-button:active {
          background-color: rgba(255, 255, 255, 0.4);
          transform: scale(0.97);
        }
        
        .keypad-button .number {
          font-size: 28px;
          font-weight: 400;
        }
        
        .keypad-button .sub-text {
          font-size: 10px;
          letter-spacing: 1px;
          margin-top: 2px;
          color: #8E8E93;
        }
        
        .call-controls {
          margin-top: 20px;
          text-align: center;
          padding: 10px 0;
        }
        
        .call-actions {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        
        .action-btn {
          background: none;
          border: none;
          border-radius: 10px;
          color: #007AFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        
        .action-btn.active {
          background-color: rgba(0, 122, 255, 0.15);
          color: #007aff;
        }
        
        .action-btn .action-icon {
          font-size: 20px;
          margin-bottom: 5px;
        }
        
        .action-btn span {
          font-size: 12px;
        }
        
        .call-btn {
          background-color: #30d158;
          border: none;
          border-radius: 50%;
          height: 55px;
          width: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          cursor: pointer;
          color: white;
          font-size: 24px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .end-call-btn {
          background-color: #ff3b30;
          border: none;
          border-radius: 50%;
          height: 55px;
          width: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          cursor: pointer;
          color: white;
          font-size: 24px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .call-active {
          text-align: center;
        }
        
        .call-status {
          color: #8e8e93;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .call-number {
          font-size: 20px;
          font-weight: 400;
          margin-bottom: 5px;
        }
        
        .call-timer {
          font-size: 14px;
          color: #8e8e93;
        }
        
        /* App Footer */
        .app-footer {
          background-color: #f9f9f9;
          border-top: 1px solid #e0e0e0;
          bottom: 0;
          display: flex;
          height: 60px;
          justify-content: space-around;
          left: 0;
          position: absolute;
          width: 100%;
        }
        
        .nav-item {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5px 0;
          width: 33.33%;
        }
        
        .nav-item.active {
          color: #007aff;
        }
        
        .nav-icon {
          font-size: 24px;
          margin-bottom: 2px;
        }
        
        .nav-label {
          font-size: 10px;
        }
        
        /* Home Indicator */
        .home-indicator {
          align-items: center;
          bottom: 5px;
          display: flex;
          height: 34px;
          justify-content: center;
          left: 0;
          position: absolute;
          width: 100%;
        }
        
        .indicator {
          background-color: #000;
          border-radius: 2px;
          height: 5px;
          width: 120px;
        }
        
        /* For the modal */
        .dialer-modal .modal-content {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        
        .dialer-modal .modal-body {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
        }
      `}</style>
    </>
  );
};

export default Dialer;