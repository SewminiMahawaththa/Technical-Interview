import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration (Replace with your actual keys)
const firebaseConfig = {
    apiKey: "AIzaSyAud2N4YoCuboR3fBZSlD-6aNB6ywuh5nc",
    authDomain: "research-dd29c.firebaseapp.com",
    projectId: "research-dd29c",
    storageBucket: "research-dd29c.firebasestorage.app",
    messagingSenderId: "187432095725",
    appId: "1:187432095725:web:c5ed550a5112ddd62ee1e4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth (No need for persistence in web apps)
const auth = getAuth(app);

// Initialize Firestore Database
const db = getFirestore(app);

export { app, auth, db };
