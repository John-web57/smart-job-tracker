// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAd2F1xDeyzaNNFSKWlLXvCYee_lwDNnvs",
  authDomain: "smart-job-tracker-66f5f.firebaseapp.com",
  projectId: "smart-job-tracker-66f5f",
  storageBucket: "smart-job-tracker-66f5f.firebasestorage.app",
  messagingSenderId: "363141686788",
  appId: "1:363141686788:web:1dc4f5193c40df6b44b751"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
