import React, { useState, useEffect, useRef } from 'react';
import './FloatingTotal.css'; // We'll create this CSS file next

function FloatingTotal({ totalCost }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const isInitialMount = useRef(true); // Ref to track initial mount

  useEffect(() => {
    // Skip the effect on the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Don't flash if cost becomes 0 (component might disappear anyway)
    if (totalCost <= 0) {
      return;
    }

    // Trigger the flash animation
    setIsFlashing(true);

    // Remove the flash class after the animation duration (e.g., 500ms)
    const timer = setTimeout(() => {
      setIsFlashing(false);
    }, 500); // Match animation duration

    // Cleanup timer on component unmount or if effect runs again before timer finishes
    return () => clearTimeout(timer);

  }, [totalCost]); // Dependency array: effect runs when totalCost changes

  // Don't render if cost is 0
  if (totalCost <= 0 && !isFlashing) { // Also check isFlashing to allow final flash if cost goes to 0
    return null;
  }

  return (
    <div className="floating-total-container">
      <span className="total-label">Summa:</span>
      {/* Conditionally apply the flash class */}
      <span className={`total-amount ${isFlashing ? 'flash-active' : ''}`}>
        {totalCost} €
      </span>
    </div>
  );
}

export default FloatingTotal; 