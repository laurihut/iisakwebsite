import React from 'react';
import './FloatingInfoButton.css'; // We'll create this CSS file next

const FloatingInfoButton = ({ onClick }) => {
  return (
    <button className="floating-info-btn" onClick={onClick} aria-label="Lisätietoja">
      <img src="/it.svg" alt="Info" width="24" height="24" />
    </button>
  );
};

export default FloatingInfoButton; 