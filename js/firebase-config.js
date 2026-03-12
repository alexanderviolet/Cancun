// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAK2zwprD7dp70mK4lmi3vyzJJAGpdQ6UY",
  authDomain: "cancun-2026.firebaseapp.com",
  databaseURL: "https://cancun-2026-default-rtdb.firebaseio.com",
  projectId: "cancun-2026",
  storageBucket: "cancun-2026.firebasestorage.app",
  messagingSenderId: "778879364526",
  appId: "1:778879364526:web:d2e5dd8decd3a2d611ec3f",
  measurementId: "G-8CLRG66XL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);