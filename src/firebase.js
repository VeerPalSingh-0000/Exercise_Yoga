// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ8aWG-lLyMfUynba9Hp5ZhT8xY0aOcSc",
  authDomain: "fitness-786e2.firebaseapp.com",
  projectId: "fitness-786e2",
  storageBucket: "fitness-786e2.firebasestorage.app",
  messagingSenderId: "953018889513",
  appId: "1:953018889513:web:89e956d0b76cba5a90b338",
  measurementId: "G-WKJ6TV8PTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
// const analytics = getAnalytics(app);
export const db = getFirestore(app);