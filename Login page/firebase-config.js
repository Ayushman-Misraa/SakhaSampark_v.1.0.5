// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZx0zABOyN7rKGikcr2aMp-Ir4Lx6R66s",
  authDomain: "sakha-a2d4a.firebaseapp.com",
  databaseURL: "https://sakha-a2d4a-default-rtdb.firebaseio.com",
  projectId: "sakha-a2d4a",
  storageBucket: "sakha-a2d4a.firebasestorage.app",
  messagingSenderId: "398429107653",
  appId: "1:398429107653:web:1c4020f03718a6971907ac",
  measurementId: "G-QGY082TZJ0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const auth = firebase.auth();
const database = firebase.database();