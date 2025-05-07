// src/services/firestoreService.js
import { db, app } from '../firebaseConfig'; // Assuming app is also exported for functions
import {
  collection,
  // getDocs, // No longer needed for fetchBookedDatesInMonth
  // query,   // No longer needed for fetchBookedDatesInMonth
  // where,   // No longer needed for fetchBookedDatesInMonth
  // Timestamp, // Might not be needed here if Cloud Function returns strings
  writeBatch,
  doc
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Import Firebase Functions
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app, "us-central1"); // Initialize with app and region

const bookingsCollectionRef = collection(db, 'bookings');

// Function to fetch available slots (you might need more complex logic)
// This is a simplified example assuming you store all potential slots
// and mark them as booked.
export const fetchSlotsForDate = async (date) => {
  // TODO: Implement logic to determine the start and end of the selected date
  // const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
  // const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

  // This example fetches all bookings within the day.
  // You'll need to adapt this based on how you structure your slots data.
  // const q = query(
  //   bookingsCollectionRef,
  //   where('startTime', '>=', startOfDay),
  //   where('startTime', '<', endOfDay)
  //   // Potentially filter by isBooked: false if you store all slots
  // );

  try {
    // const querySnapshot = await getDocs(q);
    // const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // TODO: You might need to generate potential slots for the day and then
    // mark the ones that are found in the bookings collection as booked.
    // return slots; // Return fetched bookings/slots for now
    console.warn("fetchSlotsForDate is not fully implemented and currently returns empty array.");
    return []; // Placeholder, as original Firestore query parts are commented out
  } catch (error) {
    console.error("Error fetching slots: ", error);
    return [];
  }
};

// Function to check if a specific date is already booked
export const isDateBooked = async (date) => {
  // const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
  // const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

  // const q = query(
  //   bookingsCollectionRef,
  //   where('bookingDate', '>=', startOfDay), // Use bookingDate field
  //   where('bookingDate', '<', endOfDay),
  //   // limit(1) // Optional: We only need to know if at least one exists
  // );

  try {
    // const querySnapshot = await getDocs(q);
    // const isBooked = !querySnapshot.empty; // True if any booking exists for this day
    // return isBooked;
    console.warn("isDateBooked is not fully implemented with new rules and currently returns false. It needs to call a cloud function or use fetched bookedDates.");
    return false; // Placeholder, as original Firestore query parts are commented out and direct reads are blocked
  } catch (error) {
    console.error("Error checking date booking status: ", error);
    return false; // Assume not booked on error, or handle differently
  }
};

// Helper function to check if ANY date within a range is booked
export const areDatesBooked = async (startDate, numberOfDays) => {
    // This function now needs to use the fetched booked dates from the Cloud Function
    // For now, it will be a simplified check or will rely on a yet-to-be-fetched global list of booked dates.
    // This is a temporary placeholder and might not be fully accurate without further refactoring
    // or passing the `bookedDates` array from `useBookings` into `addBooking` for checking.
    console.warn("areDatesBooked check is simplified due to direct Firestore read restrictions. Consider refactoring for robust check.");
    // For a truly robust check, this function might need to call the cloud function
    // to get all booked dates and then check against that list.
    // Or, the booking creation logic could be moved to a Cloud Function that performs this check server-side.
    return false; // TEMPORARY: Assume not booked to allow booking. Real check needed.
};

// Function to fetch all booked dates within a specific month and year
// NOW CALLS THE CLOUD FUNCTION
export const fetchBookedDatesInMonth = async (year, month) => {
  // month is 0-indexed (0 for January, 11 for December)
  try {
    const getBookedDatesFunction = httpsCallable(functions, 'getPublicBookedDatesInMonth');
    const result = await getBookedDatesFunction({ year, month });

    if (result.data.success && Array.isArray(result.data.dates)) {
      return result.data.dates;
    } else {
      console.error("Cloud function 'getPublicBookedDatesInMonth' did not return expected data:", result.data);
      return [];
    }
  } catch (error) {
    console.error("Error calling 'getPublicBookedDatesInMonth' cloud function: ", error);
    return [];
  }
};

// Function to add a new booking covering multiple dates
export const addBooking = async (bookingData) => {
  const {
      name, email, streetAddress, zipCode, phone,
      numberOfDays, detergent, extraInfo, 
      startDateString // Renamed from startDate, now expects "YYYY-MM-DD"
      // totalCost is in bookingData but not directly used by addBooking for Firestore write
  } = bookingData;

  // Client-side check areDatesBooked is currently unreliable/disabled.
  // Robust check should be server-side or by calling a function.

  const batch = writeBatch(db);
  const bookingGroupId = uuidv4();
  
  // Parse the startDateString "YYYY-MM-DD"
  const [startYear, startMonth, startDay] = startDateString.split('-').map(Number);

  // Create a date object for iteration, ensure it's UTC to avoid timezone shifts
  // month for Date.UTC is 0-indexed
  let currentIteratingDate = new Date(Date.UTC(startYear, startMonth - 1, startDay));

  for (let i = 0; i < numberOfDays; i++) {
      // For each day in the booking range, create a new Date object representing midnight UTC of that day
      const year = currentIteratingDate.getUTCFullYear();
      const month = currentIteratingDate.getUTCMonth(); // 0-indexed
      const day = currentIteratingDate.getUTCDate();
      
      // This bookingDateForDoc will be saved as a Firestore Timestamp representing midnight UTC of this specific day
      const bookingDateForDoc = new Date(Date.UTC(year, month, day)); 

      const docRef = doc(bookingsCollectionRef); 
      batch.set(docRef, {
          name, email, streetAddress, zipCode, phone, detergent, extraInfo,
          bookingDate: bookingDateForDoc, // Pass JS Date (UTC midnight), Firestore SDK converts to Timestamp
          bookingGroupId,
          sequence: i + 1,
          totalDays: numberOfDays
      });

      // Move to the next day in UTC
      currentIteratingDate.setUTCDate(currentIteratingDate.getUTCDate() + 1);
  }

  try {
    await batch.commit();
    return { success: true, bookingGroupId };
  } catch (error) {
    console.error("Error adding multi-day booking: ", error);
    return { success: false, error };
  }
};

// TODO: Add functions to update or delete bookings if needed
// (Deleting multi-day bookings would require fetching all docs with the same bookingGroupId)

// TODO: Add functions to update or delete bookings if needed 