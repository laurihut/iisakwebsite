import React, { useState } from 'react';
import TermsModal from './TermsModal'; // Import the new TermsModal component

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
  const [showDetergentInfo, setShowDetergentInfo] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false); // State for terms modal visibility

  const [formError, setFormError] = useState('');

  const openTermsModal = (e) => {
    e.preventDefault(); // Prevent label click from toggling checkbox if link is part of label
    setIsTermsModalOpen(true);
  };

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

    if (!termsAccepted) {
      setFormError('Ole hyvä ja hyväksy vuokrausehdot jatkaaksesi.');
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
      <p>Vuokraus alkaa: {selectedDate.toLocaleDateString()} kello 17</p>
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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label htmlFor="detergentToggle" style={{ marginRight: '6px' }}>Tarvitsetko pesuaineen?</label>
          <span
            onMouseEnter={() => setShowDetergentInfo(true)}
            onMouseLeave={() => setShowDetergentInfo(false)}
            style={{
              position: 'relative',
              marginLeft: '4px',
              marginBottom: '10px',
              cursor: 'pointer',
              border: '1px solid #aaa',
              borderRadius: '50%',
              width: '10px',
              height: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#555',
              backgroundColor: '#f0f0f0'
            }}
          >
            i
            {showDetergentInfo && (
              <span style={{
                position: 'absolute',
                bottom: '135%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#333',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                lineHeight: '1.4',
                textAlign: 'left',
                whiteSpace: 'normal',
                width: '220px',
                zIndex: 1001,
                boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                pointerEvents: 'none'
              }}>
                6 euron pesuaine sisältää 16 litraa pesunestettä, eli kaksi täyttä astiallista. 
                Mikäli luulet tarvitsevasi enemmän, kirjoita se lisätietojen kenttään.
              </span>
            )}
          </span>
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

      {/* Terms and Conditions Checkbox */}
      <div className="terms-checkbox-container">
        <input 
          type="checkbox" 
          id="termsAccepted"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="termsAccepted">
          Olen lukenut ja hyväksyn <a href="#" onClick={openTermsModal} className="terms-link">vuokrausehdot</a>
        </label>
      </div>

      <button 
        style={{ backgroundColor: termsAccepted ? '#ffbb00' : '#C0C0C0', color: '#1a1a1a' }} 
        type="submit" 
        disabled={!termsAccepted} >
          Varaa nyt
      </button>

      {/* Terms Modal Component */}
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </form>
  );
}

export default BookingForm; 