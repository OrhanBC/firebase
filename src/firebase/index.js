import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD40-pjlau5YDK3YgamrqZnVA1crG0mjos",
  authDomain: "internship-prep-game.firebaseapp.com",
  projectId: "internship-prep-game",
  storageBucket: "internship-prep-game.appspot.com",
  messagingSenderId: "477894884530",
  appId: "1:477894884530:web:0dbf5918279cd3b814ddab",
  measurementId: "G-GVPZWSEFVJ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const functions = firebase.functions();
const storage = firebase.storage();


export { auth, firestore, functions, storage, firebase as default }