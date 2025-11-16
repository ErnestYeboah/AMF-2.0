// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvGo14HBnfH3Nz8Ts1j2TzOPKeS9VndVA",
  authDomain: "auth-25097.firebaseapp.com",
  projectId: "auth-25097",
  storageBucket: "auth-25097.firebasestorage.app",
  messagingSenderId: "723410396693",
  appId: "1:723410396693:web:6d8249c2e920daedc2901c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const response = await signInWithPopup(auth, googleProvider);
  console.log(response.user);

  return await response.user.getIdToken();
};
