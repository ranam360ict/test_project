// // firebase.js
// // import { initializeApp } from 'firebase/app';
// // import { getFirestore } from 'firebase/firestore';
// import  {
//   initializeApp,
//   applicationDefault,
//   cert,
// } from 'firebase-admin/app'
// import { getFirestore } from "firebase-admin/firestore";
// // Firebase configuration (replace with your config from Firebase Console)
// const firebaseConfig = {
//   apiKey: 'AIzaSyCt18tZtyNqrChkqSq_gbKrVdCAhEzirAg',
//   authDomain: 'test-eedbf.firebaseapp.com',
//   projectId: 'test-eedbf',
//   storageBucket: 'test-eedbf.firebasestorage.app',
//   messagingSenderId: '344019062016',
//   appId: '1:344019062016:web:73f37e40086494a67c77e5',
//   measurementId: 'G-01SK8347KV',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// // Initialize Firestore
// // const db = getFirestore(app);

// export default db;
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Check if the app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Initialize Firestore
const db = getFirestore();

export default db;
