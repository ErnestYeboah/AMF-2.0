// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvGo14HBnfH3Nz8Ts1j2TzOPKeS9VndVA",
  authDomain: "auth-25097.firebaseapp.com",
  projectId: "auth-25097",
  storageBucket: "auth-25097.firebasestorage.app",
  messagingSenderId: "723410396693",
  appId: "1:723410396693:web:6d8249c2e920daedc2901c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // 👇 This triggers the Google sign-in popup
    const result = await signInWithPopup(auth, provider);

    // 👇 Get Firebase ID token (used to verify user with Django)
    const token = await result.user.getIdToken();

    return token;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};
