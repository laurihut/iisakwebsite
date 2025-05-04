import React from 'react'; // Import React directly
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default react-calendar styles
import './App.css';
// import TimeSlotDisplay from './components/Calendar'; // Removed
import BookingForm from './components/BookingForm';
import useBookings from './hooks/useBookings';
import { addBooking } from './services/firestoreService'; // Import the booking function

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

  const handleBookingSubmit = async (formData) => {
    // formData includes { name, email, address, phone, numberOfDays, detergent }
    if (!selectedDate) {
        alert('Something went wrong, no date selected.');
        return;
    }

    // Combine form data with the selected start date
    const fullBookingData = { ...formData, startDate: selectedDate };
    console.log('Submitting booking:', fullBookingData);

    // Pass the combined data to the service
    const result = await addBooking(fullBookingData);

    if (result.success) {
      alert('Booking successful!');
      setSelectedDate(null); // Clear selection
      refreshBookedDates(); // Refresh booked dates to disable the new one
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
      <h1>IISAKIN TEKSTIILIPESURI</h1>
      <h2>35 € / päivä + 10 € / lisäpäivä (pesuaine + 15 €)</h2>
      <p>VALITSE SOPIVA PÄIVÄ KALENTERISTA JA VARAA.</p>

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
            {/* Pass selectedDate to the form */}
            <BookingForm selectedDate={selectedDate} onSubmit={handleBookingSubmit} />
        </div>
      )}

    </div>
  );
}

export default App;
