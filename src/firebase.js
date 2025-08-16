// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// *** 1. ADD "setPersistence" and "browserLocalPersistence" TO THIS IMPORT ***
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ8aWG-lLyMfUynba9Hp5ZhT8xY0aOcSc",
  authDomain: "fitness-786e2.firebaseapp.com",
  projectId: "fitness-786e2",
  storageBucket: "fitness-786e2.firebasestorage.app",
  messagingSenderId: "953018889513",
  appId: "1:953018889513:web:89e956d0b76cba5a90b338",
  measurementId: "G-WKJ6TV8PTQ"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  // Initialize Firebase App
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);

  // *** 2. ADD THIS LINE TO SET THE PERSISTENCE ***
  setPersistence(auth, browserLocalPersistence);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  // Optional: Enable network persistence (helps with offline functionality)
  // This is especially useful for mobile apps
  
  console.log("Firebase initialized successfully");
  
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase");
}

// Optional: Enable Firebase emulators for local development
// Uncomment these lines if you're using Firebase emulators for local testing
/*
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log("Connected to Firebase emulators");
  } catch (error) {
    console.log("Emulators already connected or not available");
  }
}
*/

// Optional: Initialize Analytics (uncomment if needed)
/*
import { getAnalytics } from "firebase/analytics";
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
*/

// Export Firebase services
export { auth, db };

// Export the app instance if needed elsewhere
export default app;

// Helper function to check if Firebase is properly initialized
export const isFirebaseInitialized = () => {
  return !!(app && auth && db);
};

// Helper function to get current user safely
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Helper function to check authentication state
export const isUserAuthenticated = () => {
  return !!auth.currentUser;
};
