// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCMZwBON4DeXXpEKrFiiJJXeLjOqUE6ZwU",
  authDomain: "enruta-f194c.firebaseapp.com",
  projectId: "enruta-f194c",
  storageBucket: "enruta-f194c.firebasestorage.app",
  messagingSenderId: "1065785175676",
  appId: "1:1065785175676:web:2bf0f919cff3f6d13023f9",
  measurementId: "G-QD2590PNSB",
  databaseURL: "https://enruta-f194c-default-rtdb.firebaseio.com"  // IMPORTANTE: Pon aquí la URL de tu Realtime Database
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
