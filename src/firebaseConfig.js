// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// Add other services like auth, storage as needed
// import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_WuePx0gg3HEZQNtCDL2jzTcRCH7NGcQ",
    authDomain: "iisakintekstiilipesuri.firebaseapp.com",
    projectId: "iisakintekstiilipesuri",
    storageBucket: "iisakintekstiilipesuri.firebasestorage.app",
    messagingSenderId: "605300048092",
    appId: "1:605300048092:web:8c887f96b9358e2cc23419"
  };

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