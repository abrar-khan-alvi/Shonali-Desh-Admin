import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA2RoB6ElxZFdEwuvwjCfH8wV-ahr1HuIM",
    authDomain: "shonali-desh-19ead.firebaseapp.com",
    databaseURL: "https://shonali-desh-19ead-default-rtdb.firebaseio.com",
    projectId: "shonali-desh-19ead",
    storageBucket: "shonali-desh-19ead.firebasestorage.app",
    messagingSenderId: "755018107118",
    appId: "1:755018107118:web:a3705ae82bcc1ed4518bff",
    measurementId: "G-JBYJ1DVFXK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
