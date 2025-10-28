// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9JzSKnrxi4ug4XB7FDaH_AS9GxiFVFpU",
  authDomain: "appmovil-b18de.firebaseapp.com",
  projectId: "appmovil-b18de",
  storageBucket: "appmovil-b18de.firebasestorage.app",
  messagingSenderId: "930074871065",
  appId: "1:930074871065:web:c4c466acf3ce2bc951f188",
  measurementId: "G-HVTR438V5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
// para usar la base de datos
export const db= getFirestore(app);
