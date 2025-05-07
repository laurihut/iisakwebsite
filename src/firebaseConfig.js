// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
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
    // You might want to throw an error or display a message to the user
    console.error("Firebase API Key is missing. Check environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize App Check
const reCAPTCHA_SITE_KEY = '6Ldu3jArAAAAALsr4akYlb43E_Fthk0kbbMZWbf9'; // Your Site Key

if (reCAPTCHA_SITE_KEY) {
    try {
        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(reCAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true
        });
        console.log("Firebase App Check initialized with reCAPTCHA v3.");
    } catch (error) {
        console.error("Error initializing Firebase App Check:", error);
    }
} else {
    console.warn("reCAPTCHA Site Key is missing. App Check not initialized.");
}

// Initialize other services if needed
// const auth = getAuth(app);

// Export the instances you need
export { db, app }; // Export db to be used in firestoreService.js
// export { auth }; 