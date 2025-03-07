import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC_FLCIBWdReqRPmWFZB1L_4rhLntNWuyA",
    authDomain: "message-4138f.firebaseapp.com",
    projectId: "message-4138f",
    storageBucket: "message-4138f.firebasestorage.app",
    messagingSenderId: "197072020008",
    appId: "1:197072020008:web:e0676251a0d313260dcb1d",
    measurementId: "G-GD15C1MZW2"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth, createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail };
