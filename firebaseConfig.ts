// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

import "firebase/compat/database";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA8zu4FFQy8I75P2gAC4oil2wNwk70fpM",
  authDomain: "momentoon-cd88f.firebaseapp.com",
  databaseURL: "https://momentoon-cd88f-default-rtdb.firebaseio.com",
  projectId: "momentoon-cd88f",
  storageBucket: "momentoon-cd88f.appspot.com",
  messagingSenderId: "870406035767",
  appId: "1:870406035767:web:c13f7376b020aa4366e2b2",
};

// Initialize Firebase
/*
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}*/
firebase.initializeApp(firebaseConfig);

export const firebase_db = firebase.database();
//export const firebase_storage = firebase.storage();
