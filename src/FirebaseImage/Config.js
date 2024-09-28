// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlMnTjdn91r5_asKBpigPTDGD8lf-9-t8",
  authDomain: "libook-4c5d8.firebaseapp.com",
  projectId: "libook-4c5d8",
  storageBucket: "libook-4c5d8.appspot.com",
  messagingSenderId: "85999138169",
  appId: "1:85999138169:web:4b3492212cc88d569a6ba8",
  measurementId: "G-BWB5GVMGVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app};