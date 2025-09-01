// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "tictac-infinity",
  appId: "1:454330986633:web:bb6a3f2cb62211ee6f5658",
  storageBucket: "tictac-infinity.firebasestorage.app",
  apiKey: "AIzaSyAEQH9oApDiY5zt0X-EsBWyzDeD-bUvn50",
  authDomain: "tictac-infinity.firebaseapp.com",
  messagingSenderId: "454330986633",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
