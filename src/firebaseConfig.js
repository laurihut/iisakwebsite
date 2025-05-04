// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Add other services like auth, storage as needed
// import { getAuth } from "firebase/auth";

// Read configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

// Basic check to ensure variables are loaded
if (!firebaseConfig.apiKey) {
    console.error("Firebase config not loaded. Ensure .env file is set up correctly and VITE_ prefixes are used.");
    // You might want to throw an error or display a message to the user
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize other services if needed
// const auth = getAuth(app);

// Export the instances you need
export { db }; // Export db to be used in firestoreService.js
// export { auth }; 