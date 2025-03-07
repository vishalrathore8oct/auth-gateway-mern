// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-gateway.firebaseapp.com",
  projectId: "mern-auth-gateway",
  storageBucket: "mern-auth-gateway.firebasestorage.app",
  messagingSenderId: "191888865211",
  appId: "1:191888865211:web:917bd1b3bea2020a52b69e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);