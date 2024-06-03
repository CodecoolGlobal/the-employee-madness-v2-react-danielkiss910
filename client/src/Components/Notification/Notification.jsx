import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <button className="close-btn" onClick={onClose}>x</button>
      <div className="message">{message}</div>
    </div>
  );
};

export default Notification;
