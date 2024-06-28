// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgp97Tu9rvu1R1IaTXXfOE_VUdMQbAF-4",
  authDomain: "chat-app-bbd11.firebaseapp.com",
  projectId: "chat-app-bbd11",
  storageBucket: "chat-app-bbd11.appspot.com",
  messagingSenderId: "865070748461",
  appId: "1:865070748461:web:b72861a4568677a9a7b9a4",
  measurementId: "G-6Z4MBEGY9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();