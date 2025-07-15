import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnk551SVd_GIfDUhW2oQAymA-91k2ldvs",
  authDomain: "tictactoe-be927.firebaseapp.com",
  projectId: "tictactoe-be927",
  storageBucket: "tictactoe-be927.firebasestorage.app",
  messagingSenderId: "646395377044",
  appId: "1:646395377044:web:f2084dc90478b5c4c80b81"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
