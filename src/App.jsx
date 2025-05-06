import React, { useState, useEffect } from 'react'; // Import useEffect
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default react-calendar styles
import './App.css';
// import TimeSlotDisplay from './components/Calendar'; // Removed
import BookingForm from './components/BookingForm';
import useBookings from './hooks/useBookings';
import { addBooking } from './services/firestoreService'; // Import the booking function
import FloatingTotal from './components/FloatingTotal'; // Import new component
import FloatingInfoButton from './components/FloatingInfoButton'; // Import new component
import InfoModal from './components/InfoModal'; // Import new component

function App() {
  // Get state and functions from the updated hook
  const {
    selectedDate,
    setSelectedDate,
    bookedDates, // YYYY-MM-DD strings
    isLoading,
    error,
    activeStartDate,
    setActiveStartDate,
    refreshBookedDates
  } = useBookings();

  // Lifted state for calculation
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [detergent, setDetergent] = useState(false);
  const [totalCost, setTotalCost] = useState(0); // State for the calculated cost
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // State for the info modal

  // Remove selectedSlot state - ALREADY DONE

  // --- Calculate Total Cost --- 
  useEffect(() => {
    let cost = 0;
    if (numberOfDays >= 1) {
        cost = 35; // Base cost for the first day
        cost += (numberOfDays - 1) * 10; // Add 10 for each extra day
    }
    if (detergent) {
        cost += 6; // Add detergent cost
    }
    setTotalCost(cost);
  }, [numberOfDays, detergent]);

  const handleBookingSubmit = async (formData) => {
    // formData includes { name, email, address, phone, numberOfDays, detergent }
    if (!selectedDate) {
        alert('Something went wrong, no date selected.');
        return;
    }

    // Combine form data with lifted state and selected start date
    const fullBookingData = {
        ...formData, // name, email, streetAddress, zipCode, phone, extraInfo
        numberOfDays,
        detergent,
        startDate: selectedDate
    };
    console.log('Submitting booking:', fullBookingData);

    const result = await addBooking(fullBookingData);

    if (result.success) {
      alert('Booking successful!');
      setSelectedDate(null); // Clear selection
      // Optionally reset form fields (if not done in BookingForm)
      // setNumberOfDays(1); // Reset days
      // setDetergent(false); // Reset detergent
      refreshBookedDates();
    } else {
      alert(`Booking failed: ${result.error?.message || 'Unknown error'}`);
    }
  };

  // Handler for react-calendar date selection
  const onDateChange = (newDate) => {
    // Check if the selected date is already booked before setting it
    const dateString = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
    if (bookedDates.includes(dateString)) {
        setSelectedDate(null); // Don't select if already booked
        alert('This date is already booked.');
    } else {
        setSelectedDate(newDate); // Set the selected date if available
    }
  };

  // Function to disable tiles (dates) in the calendar
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      // Check if the date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Compare dates only
      if (date < today) {
          return true;
      }
      // Check if the date is in our list of booked dates
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return bookedDates.includes(dateString);
    }
    return false; // Disable only month view tiles for now
  };

  return (
    <div className="app-container"> {/* Use a container for better layout */}
      <h1 className="main-title">IISAKIN TEKSTIILIPESURI</h1>
      {/* Wrap subtitle and instructions */}
      <div className="info-box">
        <h2 className="subtitle">35 € / päivä + 10 € / lisäpäivä (pesuaine + 15 €)</h2>
        <br></br>
        <p className="instructions">VALITSE SOPIVA PÄIVÄ KALENTERISTA JA VARAA.</p>
      </div>

      {/* Floating Info Button */}
      <FloatingInfoButton onClick={() => setIsInfoModalOpen(true)} />

      {/* Info Modal */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />

      {/* Basic Date Selection - Replace with a proper calendar UI later */}
      {/* <div className="date-selector">
        <label htmlFor="booking-date">Select Date: </label>
        <input
          type="date"
          id="booking-date"
          value={selectedDate.toISOString().split('T')[0]} // Format date for input
          onChange={handleDateChange}
        />
      </div> */}

      <div className="calendar-container">
        {error && <p className="error-message">Error loading availability: {error}</p>}
        {isLoading && <p>Loading availability...</p>}
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          // minDate={new Date()} // Disabled in favor of tileDisabled for past dates
          tileDisabled={tileDisabled} // Use the function to disable tiles
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)} // Update hook when view changes
          activeStartDate={activeStartDate} // Control the current view
        />
      </div>

      {/* Remove Timeslots container */}
      {/* <div className="timeslots-container"> ... </div> */}

      {/* Show booking form only when a valid date is selected */}
      {selectedDate && (
        <div className="booking-form-container">
          <BookingForm
            selectedDate={selectedDate}
            onSubmit={handleBookingSubmit}
            // Pass down state and setters
            numberOfDays={numberOfDays}
            detergent={detergent}
            onNumberOfDaysChange={setNumberOfDays}
            onDetergentChange={setDetergent}
          />
        </div>
      )}

      {/* Floating Total Display - Render only when a date is selected */}
      {selectedDate && <FloatingTotal totalCost={totalCost} />}

    </div>
  );
}

export default App;
