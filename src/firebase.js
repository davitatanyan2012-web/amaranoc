import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTWw7MWHVHpzj38rR5WA0mCXDyfTWhBnM",
  authDomain: "amaranoc-chat.firebaseapp.com",
  projectId: "amaranoc-chat",
  storageBucket: "amaranoc-chat.firebasestorage.app",
  messagingSenderId: "787702231786",
  appId: "1:787702231786:web:2fd197835b50f783a95d93",
  measurementId: "G-ZFY5T3PJGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { signInWithPopup, signOut };