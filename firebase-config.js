// firebase-config.js

// !!! ÎNLOCUIEȘTE ACEST OBIECT CU CEL DIN CONSOLA TA FIREBASE !!!
const firebaseConfig = {
  apiKey: "AIzaSyDa2r9t3kWGUpoiuqRaaKvYpWlJ_V8-yMI",
  authDomain: "body-dashboard-sorin.firebaseapp.com",
  projectId: "body-dashboard-sorin",
  storageBucket: "body-dashboard-sorin.firebasestorage.app",
  messagingSenderId: "895437811384",
  appId: "1:895437811384:web:6f735fd10b35bf448fce4d",
  measurementId: "G-JYGMGKFQB8"
};

// Inițializează Firebase
firebase.initializeApp(firebaseConfig);

// Exportă serviciile pe care le vom folosi în alte fișiere
const db = firebase.firestore();
const auth = firebase.auth(); // Pregătit pentru viitor

export { db, auth };
