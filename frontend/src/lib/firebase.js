import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyABsMQA_xc0odXbxctxl3fawn1fPnJnids",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "isaicraft.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "isaicraft",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "isaicraft.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "220318688592",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:220318688592:web:6c36c33aabcb2c6df13855",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7FNML3QM11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;
