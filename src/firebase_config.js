// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCByqRPa0kDsiKw7OCGVcWPsGtPVcbOV-c",
  authDomain: "react-js-cd98f.firebaseapp.com",
  projectId: "react-js-cd98f",
  storageBucket: "react-js-cd98f.appspot.com",
  messagingSenderId: "847718385346",
  appId: "1:847718385346:web:7962923c0d7c8477009d5b",
  measurementId: "G-F23MFKGTKG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
