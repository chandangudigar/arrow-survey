// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1kqKFkPO0mvG5ESkUDgqDbV9ogwregXw",
  authDomain: "arrow-survey.firebaseapp.com",
  projectId: "arrow-survey",
  storageBucket: "arrow-survey.firebasestorage.app",
  messagingSenderId: "538089905333",
  appId: "1:538089905333:web:f2bbd41df8b3d42d6b32fc",
  measurementId: "G-RNZ44XY70T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth();

export default app;
