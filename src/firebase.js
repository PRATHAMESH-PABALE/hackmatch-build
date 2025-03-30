import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyBUkv6YaTZe9Me_ncAd5mMG8n7YezwcTws",
  authDomain: "hackmatch---build-your-team.firebaseapp.com",
  projectId: "hackmatch---build-your-team",
  storageBucket: "hackmatch---build-your-team.firebasestorage.app",
  messagingSenderId: "885874784942",
  appId: "1:885874784942:web:652da29253ac0b42ffcb3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Storage
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider }; // ✅ Export Storage
