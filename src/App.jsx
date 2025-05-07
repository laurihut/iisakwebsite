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
    bookedDates,
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
  const [selectedDateString, setSelectedDateString] = useState(null); // Store as YYYY-MM-DD string

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

  // Revalidate the selected date whenever numberOfDays changes
  useEffect(() => {
    if (selectedDateString && numberOfDays > 1) {
      // Use the helper function to check if the date range is still valid
      if (!isDateRangeValid(selectedDateString, numberOfDays)) {
        // Instead of clearing selection, just reset to 1 day rental
        setNumberOfDays(1);
        alert('Some days in your selected range are already booked. Rental duration has been changed to 1 day.');
      }
    }
  }, [numberOfDays, selectedDateString, bookedDates]);

  const handleBookingSubmit = async (formDataFromBookingForm) => {
    if (!selectedDateString) {
        alert('Something went wrong, no date selected.');
        return;
    }

    // formDataFromBookingForm contains: name, email, streetAddress, zipCode, phone, extraInfo
    // It also contains numberOfDays, detergent, totalCost which were passed to BookingForm
    // and are also in App.jsx state. We should be consistent.
    // The Cloud Function for email expects selectedDateString.
    // addBooking in firestoreService will expect startDateString.

    const bookingDetailsForService = {
        ...formDataFromBookingForm, // Includes name, email, etc., and also totalCost, numberOfDays, detergent
        startDateString: selectedDateString, // Pass the YYYY-MM-DD string
    };

    // Call addBooking from firestoreService
    const result = await addBooking(bookingDetailsForService);

    if (result.success) {
      alert('Booking successful!');
      setSelectedDateString(null); // Clear selection
      refreshBookedDates();
    } else {
      alert(`Booking failed: ${result.error?.message || 'Unknown error'}`);
    }
  };

  // Helper function to check if a date range is valid
  const isDateRangeValid = (startDateString, days) => {
    if (!startDateString || days < 1) return false;
    
    // Parse the selected date string
    const [year, month, day] = startDateString.split('-').map(Number);
    const tempDate = new Date(year, month - 1, day);
    
    // First date is the start date itself
    if (bookedDates.includes(startDateString)) return false;
    
    // Check each subsequent day in the booking range
    for (let i = 1; i < days; i++) {
      // Move to the next day
      tempDate.setDate(tempDate.getDate() + 1);
      
      // Format the date as YYYY-MM-DD string
      const nextDateString = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`;
      
      // If any day in the range is booked, the range is invalid
      if (bookedDates.includes(nextDateString)) {
        return false;
      }
    }
    
    return true; // All days in range are available
  };

  const onDateChange = (newDate) => { // newDate is a JS Date object from react-calendar
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // Check if the first day (selected date) is already booked
    if (bookedDates.includes(dateString)) {
        setSelectedDateString(null);
        alert('This date is already booked.');
        return;
    }

    // Check for multi-day bookings: verify all days in the range are available
    if (numberOfDays > 1) {
        if (!isDateRangeValid(dateString, numberOfDays)) {
            // Instead of clearing selection, set the date but change rental to 1 day
            setSelectedDateString(dateString);
            setNumberOfDays(1);
            alert('Some days in your selected range are already booked. Rental duration has been changed to 1 day.');
            return;
        }
    }

    // If all days are available, set the selected date
    setSelectedDateString(dateString);
  };

  // Function to disable tiles (dates) in the calendar
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Disable dates in the past
      if (date < today && date.toDateString() !== today.toDateString()) { // Allow today
          return true;
      }
      
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Directly booked dates are always disabled
      if (bookedDates.includes(dateString)) {
          return true;
      }
      
      // The bug was here: We were checking multi-day conflicts for ALL tiles,
      // rather than just evaluating if this tile could be a valid start date.
      // We should only check future dates from this tile if it's being considered as a start date.
      
      return false; // Not disabled if we reach here
    }
    return false;
  };
  
  // Helper to convert YYYY-MM-DD string back to Date for react-calendar value prop
  const getCalendarValue = () => {
    if (!selectedDateString) return null;
    const [year, month, day] = selectedDateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed for Date constructor
  };

  return (
    <div className="app-container"> {/* Use a container for better layout */}
      <h1 className="main-title">IISAKIN TEKSTIILIPESURI</h1>
      {/* Wrap subtitle and instructions */}
      <div className="info-box">
        <h2 className="subtitle">35 € / päivä + 10 € / lisäpäivä (pesuaine + 6 €)</h2>
        <br></br>
        <p className="instructions">VALITSE SOPIVA PÄIVÄ KALENTERISTA JA VARAA KÄRCHER PUZZI 8/1 TEKSTIILIPESURI.</p>
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
          value={getCalendarValue()} // Use helper to convert string to Date for calendar
          tileDisabled={tileDisabled}
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
          activeStartDate={activeStartDate}
        />
      </div>

      {/* Remove Timeslots container */}
      {/* <div className="timeslots-container"> ... </div> */}

      {/* Show booking form only when a valid date is selected */}
      {selectedDateString && (
        <div className="booking-form-container">
          <BookingForm
            selectedDateString={selectedDateString} // Pass as YYYY-MM-DD string
            onSubmit={handleBookingSubmit} // This will receive all form data
            numberOfDays={numberOfDays}
            detergent={detergent}
            onNumberOfDaysChange={setNumberOfDays}
            onDetergentChange={setDetergent}
            totalCost={totalCost}
          />
        </div>
      )}

      {/* Floating Total Display - Render only when a date is selected */}
      {selectedDateString && <FloatingTotal totalCost={totalCost} />}

    </div>
  );
}

export default App;
