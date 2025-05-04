import React, { useState } from 'react';

function BookingForm({ selectedDate, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [detergent, setDetergent] = useState(false);
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

    // Pass all data including the new fields
    onSubmit({
        name,
        email,
        streetAddress,
        zipCode,
        phone,
        numberOfDays: parseInt(numberOfDays, 10),
        detergent,
        extraInfo
    });

    // Clear form (optional, consider keeping date selected)
    // setName('');
    // setEmail('');
    // setAddress('');
    // setPhone('');
    // setNumberOfDays(1);
    // setDetergent(false);
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

      {/* Replace Number Input with Buttons */}
      <div>
        <label>Kuinka moneksi päiväksi haluat vuokrata:</label>
        <div className="days-buttons-container">
            {[1, 2, 3, 4, 5].map((days) => (
                <button
                    type="button" // Important: prevent form submission
                    key={days}
                    className={`day-button ${numberOfDays === days ? 'active' : ''}`}
                    onClick={() => setNumberOfDays(days)}
                >
                    {days}
                </button>
            ))}
        </div>
      </div>

      {/* Toggle Switch on its own line */}
      <div className="detergent-option toggle-option">
        <div> {/* Div for the text label */} 
          <label htmlFor="detergentToggle">Tarvitsetko pesuainetta?</label>
        </div>
        <div> {/* Div for the switch mechanism */} 
          <input
              type="checkbox"
              id="detergentToggle"
              className="toggle-checkbox"
              checked={detergent}
              onChange={(e) => setDetergent(e.target.checked)}
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