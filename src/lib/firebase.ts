import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpu8MHkNAK98NGIClqrRP0b9X9XjhwZk8",
    authDomain: "deengpt-32562.firebaseapp.com",
    projectId: "deengpt-32562",
    storageBucket: "deengpt-32562.firebasestorage.app",
    messagingSenderId: "637956869246",
    appId: "1:637956869246:web:270fc2ab58996664049c2f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
