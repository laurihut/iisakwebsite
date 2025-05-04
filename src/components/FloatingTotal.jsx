import React from 'react';
import './FloatingTotal.css'; // We'll create this CSS file next

function FloatingTotal({ totalCost }) {
  // Don't render if cost is 0 (e.g., initial state)
  if (totalCost <= 0) {
    return null;
  }

  return (
    <div className="floating-total-container">
      <span className="total-label">Total:</span>
      <span className="total-amount">{totalCost} €</span>
    </div>
  );
}

export default FloatingTotal; 