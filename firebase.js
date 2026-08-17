// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB2OYZql1q6ECFcUI8dZF_HUPDnP1sOC4",
  authDomain: "watchdemo-e8450.firebaseapp.com",
  projectId: "watchdemo-e8450",
  storageBucket: "watchdemo-e8450.firebasestorage.app",
  messagingSenderId: "500723648647",
  appId: "1:500723648647:web:fe60430319522ff681d022"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;