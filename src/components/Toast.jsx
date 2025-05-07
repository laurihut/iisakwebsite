import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose, autoCloseTime = 5000 }) => {
  useEffect(() => {
    if (isVisible && autoCloseTime > 0) {
      const timeout = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, autoCloseTime, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast-container ${isVisible ? 'visible' : ''}`}>
      <div className={`toast-message ${type}`}>
        <div className="toast-content">
          {type === 'success' && <span className="toast-icon">✓</span>}
          {type === 'error' && <span className="toast-icon">✗</span>}
          {type === 'warning' && <span className="toast-icon">⚠</span>}
          {type === 'info' && <span className="toast-icon">ℹ</span>}
          <p>{message}</p>
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Toast; 