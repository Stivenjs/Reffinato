import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCMQWxIb0heLm1wH9z_49ILxuECMk_JW8o",
  authDomain: "reffinato-shop.firebaseapp.com",
  projectId: "reffinato-shop",
  storageBucket: "reffinato-shop.firebasestorage.app",
  messagingSenderId: "667422132503",
  appId: "1:667422132503:web:b147d4f98b3f8535bacf52",
  measurementId: "G-WV6K0KBBJQ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
