// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB91dq42fv2GhD5Y5X5gqSqKLMAr8qIrAc",
  authDomain: "sinuca-71370.firebaseapp.com",
  projectId: "sinuca-71370",
  storageBucket: "sinuca-71370.firebasestorage.app",
  messagingSenderId: "363859079156",
  appId: "1:363859079156:web:30c6cc6ee651f35a04d3a1",
  measurementId: "G-TY10127Q0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);