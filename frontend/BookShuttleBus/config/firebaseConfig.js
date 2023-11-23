// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDmks2oazUfJuRZUcew6WPbi9iV1k_MD4",
  authDomain: "bookshuttleapp.firebaseapp.com",
  projectId: "bookshuttleapp",
  storageBucket: "bookshuttleapp.appspot.com",
  messagingSenderId: "450628130544",
  appId: "1:450628130544:web:00109e982a629e4426d435",
  measurementId: "G-EZ2354T6BS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);