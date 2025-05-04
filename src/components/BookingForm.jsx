import React, { useState } from 'react';

// Accept props including lifted state and callbacks
function BookingForm({
    selectedDate,
    onSubmit,
    numberOfDays,
    detergent,
    onNumberOfDaysChange,
    onDetergentChange
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [extraInfo, setExtraInfo] = useState('');

  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedDate) {
      setFormError('Please select a start date first.');
      return;
    }
    // Basic validation
    if (!name || !email || !streetAddress || !zipCode || !phone) {
      setFormError('Please fill in all contact details.');
      return;
    }
    if (numberOfDays < 1) {
        setFormError('Number of days must be at least 1.');
        return;
    }

    // Simple email validation regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Pass only form-specific data. Days/detergent already in App state.
    onSubmit({
        name,
        email,
        streetAddress,
        zipCode,
        phone,
        extraInfo
    });
    // Consider if clearing fields here is desired, or in App.jsx after success
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h3>Kirjoita yhteystiedot ja valitse päivä</h3>
      <p>Alkaa: {selectedDate.toLocaleDateString()}</p>
      {formError && <p className="error-message" style={{ textAlign: 'center' }}>{formError}</p>}

      <div>
        <label htmlFor="name">Nimi:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Sähköposti:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="streetAddress">Katuosoite:</label>
        <input
          type="text"
          id="streetAddress"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="zipCode">Postinumero:</label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="phone">Puhelinnumero:</label>
        <input
          type="tel" // Use type="tel" for phone numbers
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* Day Buttons - Use prop and callback */}
      <div>
        <label>Kuinka moneksi päiväksi haluat varata:</label>
        <div className="days-buttons-container">
            {[1, 2, 3, 4, 5].map((days) => (
                <button
                    type="button"
                    key={days}
                    className={`day-button ${numberOfDays === days ? 'active' : ''}`}
                    onClick={() => onNumberOfDaysChange(days)} // Use callback
                >
                    {days}
                </button>
            ))}
        </div>
      </div>

      {/* Toggle Switch - Use prop and callback */}
      <div className="detergent-option toggle-option">
        <div>
          <label htmlFor="detergentToggle">Tarvitsetko pesuaineen?</label>
        </div>
        <div>
          <input
              type="checkbox"
              id="detergentToggle"
              className="toggle-checkbox"
              checked={detergent} // Use prop
              onChange={(e) => onDetergentChange(e.target.checked)} // Use callback
          />
          <label htmlFor="detergentToggle" className="switch-label"></label>
        </div>
      </div>

      {/* New Extra Info Field */}
      <div>
          <label htmlFor="extraInfo">Lisätietoja (valinnainen):</label>
          <textarea
            id="extraInfo"
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            rows="3" // Adjust number of rows as needed
          ></textarea>
      </div>

      <button type="submit">Varaa nyt</button>
    </form>
  );
}

export default BookingForm; 