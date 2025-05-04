// src/services/firestoreService.js
import { db } from '../firebaseConfig'; // Assuming db is exported from firebaseConfig
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  writeBatch, // Import writeBatch for atomic multi-document writes
  doc // Import doc for creating new documents
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating group ID

const bookingsCollectionRef = collection(db, 'bookings');

// Function to fetch available slots (you might need more complex logic)
// This is a simplified example assuming you store all potential slots
// and mark them as booked.
export const fetchSlotsForDate = async (date) => {
  // TODO: Implement logic to determine the start and end of the selected date
  const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
  const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

  // This example fetches all bookings within the day.
  // You'll need to adapt this based on how you structure your slots data.
  const q = query(
    bookingsCollectionRef,
    where('startTime', '>=', startOfDay),
    where('startTime', '<', endOfDay)
    // Potentially filter by isBooked: false if you store all slots
  );

  try {
    const querySnapshot = await getDocs(q);
    const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched slots for date:", date, slots);
    // TODO: You might need to generate potential slots for the day and then
    // mark the ones that are found in the bookings collection as booked.
    return slots; // Return fetched bookings/slots for now
  } catch (error) {
    console.error("Error fetching slots: ", error);
    return [];
  }
};

// Function to check if a specific date is already booked
export const isDateBooked = async (date) => {
  const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
  const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

  const q = query(
    bookingsCollectionRef,
    where('bookingDate', '>=', startOfDay), // Use bookingDate field
    where('bookingDate', '<', endOfDay),
    // limit(1) // Optional: We only need to know if at least one exists
  );

  try {
    const querySnapshot = await getDocs(q);
    const isBooked = !querySnapshot.empty; // True if any booking exists for this day
    console.log(`Date ${date.toDateString()} booked status:`, isBooked);
    return isBooked;
  } catch (error) {
    console.error("Error checking date booking status: ", error);
    return false; // Assume not booked on error, or handle differently
  }
};

// Helper function to check if ANY date within a range is booked
export const areDatesBooked = async (startDate, numberOfDays) => {
    const datesToCheck = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < numberOfDays; i++) {
        datesToCheck.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check each date individually
    for (const date of datesToCheck) {
        const booked = await isDateBooked(date);
        if (booked) {
            console.log(`Conflict found: Date ${date.toDateString()} is already booked.`);
            return true; // Found a booked date in the range
        }
    }

    return false; // No conflicts found
};

// Function to fetch all booked dates within a specific month and year
export const fetchBookedDatesInMonth = async (year, month) => {
  // month is 0-indexed (0 for January, 11 for December)
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1); // First day of next month

  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(
    bookingsCollectionRef,
    where('bookingDate', '>=', startTimestamp),
    where('bookingDate', '<', endTimestamp)
  );

  try {
    const querySnapshot = await getDocs(q);
    // Return just the bookingDate Timestamps
    const bookedDates = querySnapshot.docs.map(doc => doc.data().bookingDate);
    console.log(`Fetched ${bookedDates.length} booked dates for ${year}-${month + 1}`);
    return bookedDates;
  } catch (error) {
    console.error("Error fetching booked dates for month: ", error);
    return [];
  }
};

// Function to add a new booking covering multiple dates
export const addBooking = async (bookingData) => {
  // bookingData updated with new fields
  const {
      name,
      email,
      streetAddress, // New
      zipCode,       // New
      phone,
      numberOfDays,
      detergent,
      extraInfo,     // New
      startDate
  } = bookingData;

  // 1. Check if the entire range is available
  const rangeBooked = await areDatesBooked(startDate, numberOfDays);
  if (rangeBooked) {
    console.warn(`Attempted to book an already booked date range starting ${startDate.toDateString()}`);
    return { success: false, error: new Error('One or more dates in the selected range are already booked.') };
  }

  // 2. Prepare batch write for all dates in the range
  const batch = writeBatch(db);
  const bookingGroupId = uuidv4(); // Generate a unique ID for this booking group
  const currentDate = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
      const bookingDateTimestamp = Timestamp.fromDate(new Date(currentDate.setHours(0, 0, 0, 0)));
      const docRef = doc(bookingsCollectionRef);

      batch.set(docRef, {
          name,
          email,
          streetAddress, // Store new field
          zipCode,       // Store new field
          phone,
          detergent,
          extraInfo,     // Store new field
          bookingDate: bookingDateTimestamp,
          bookingGroupId,
          sequence: i + 1,
          totalDays: numberOfDays
      });

      // Move to the next day for the next iteration
      currentDate.setDate(currentDate.getDate() + 1);
  }

  // 3. Commit the batch
  try {
    await batch.commit();
    console.log(`Booking added for ${numberOfDays} days starting ${startDate.toDateString()} with Group ID: ${bookingGroupId}`);
    return { success: true, bookingGroupId };
  } catch (error) {
    console.error("Error adding multi-day booking: ", error);
    return { success: false, error };
  }
};

// TODO: Add functions to update or delete bookings if needed
// (Deleting multi-day bookings would require fetching all docs with the same bookingGroupId)

// TODO: Add functions to update or delete bookings if needed 