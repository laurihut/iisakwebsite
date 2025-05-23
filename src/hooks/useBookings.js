import { useState, useEffect, useCallback } from 'react';
import { fetchBookedDatesInMonth } from '../services/firestoreService';

function useBookings() {
  // State for the currently selected date by the user
  const [selectedDate, setSelectedDate] = useState(null);
  // State to hold the dates that are already booked (for disabling in calendar)
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // State to track the month currently displayed in the calendar
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const loadBookedDates = useCallback(async (date) => {
    setIsLoading(true);
    setError(null);
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const fetchedBookedDateStrings = await fetchBookedDatesInMonth(year, month);

      // fetchBookedDatesInMonth now directly returns YYYY-MM-DD strings
      setBookedDates(fetchedBookedDateStrings);

    } catch (err) {
      console.error("Error in useBookings loading booked dates: ", err);
      setError('Failed to load booking availability.');
      setBookedDates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load booked dates when the active month/year changes in the calendar
  useEffect(() => {
    loadBookedDates(activeStartDate);
  }, [activeStartDate, loadBookedDates]);

  // Function to refresh booked dates for the current view
  const refreshBookedDates = useCallback(() => {
    loadBookedDates(activeStartDate);
  }, [activeStartDate, loadBookedDates]);

  return {
    selectedDate,
    setSelectedDate, // Function to set the date chosen by the user
    bookedDates,     // Array of YYYY-MM-DD strings for booked dates
    isLoading,
    error,
    activeStartDate,   // The start date of the current calendar view (month)
    setActiveStartDate, // Function called by calendar when view changes
    refreshBookedDates,// Manually trigger refresh
  };
}

export default useBookings; 