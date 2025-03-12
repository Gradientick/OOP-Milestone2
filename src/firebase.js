import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCcwiK3Ma2FR3vtmZVx6XMdUqxIv9b9Jrk",
    authDomain: "motorph-payroll-system-oop.firebaseapp.com",
    projectId: "motorph-payroll-system-oop",
    storageBucket: "motorph-payroll-system-oop.firebasestorage.app",
    messagingSenderId: "133718654070",
    appId: "1:133718654070:web:ad8b9801b6cd49abd03357",
    measurementId: "G-Z1SK57F19S"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);