import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDJy7wxYiDYj7dajf94_w58Nh-KGvZI4Ac",
  authDomain: "reffinato-6bad3.firebaseapp.com",
  projectId: "reffinato-6bad3",
  storageBucket: "reffinato-6bad3.firebasestorage.app",
  messagingSenderId: "970843907048",
  appId: "1:970843907048:web:16748f2f9fb9efe3743a5d",
  measurementId: "G-7NT5SX3REX",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
