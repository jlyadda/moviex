// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database'; // Import for Realtime Database

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYg9QBZBUny3VhvCppTk5OqVFMSz3FO1A",
  authDomain: "moviex-85e42.firebaseapp.com",
  projectId: "moviex-85e42",
  storageBucket: "moviex-85e42.firebasestorage.app",
  messagingSenderId: "960970435897",
  appId: "1:960970435897:web:b3486a66da30cc54c34ce8",
  measurementId: "G-34MMSWT192"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in web environments (avoid React Native runtime errors)
let analytics;
try {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // Analytics not available in this environment
  // console.warn('Firebase analytics not initialized:', e);
}

const database = getDatabase(app);

export { database, analytics };