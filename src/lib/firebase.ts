import { initializeApp } from "firebase/app";
import {
	getFirestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, query, orderBy, where
} from "firebase/firestore";
import {
	getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
	signInWithPopup, GoogleAuthProvider
} from "firebase/auth";
import {
	getStorage, ref, uploadBytes, getDownloadURL
} from "firebase/storage";
import {getFunctions} from "firebase/functions";

// 🔹 Firebase Configuration
const firebaseConfig = {
	apiKey: "AIzaSyB83tf0bjfl_PZ6_VcgKG79y5d0xV7YOmE",
	authDomain: "glenwood-principal-application.firebaseapp.com",
	projectId: "glenwood-principal-application",
	storageBucket: "glenwood-principal-application.firebasestorage.app",
	messagingSenderId: "448544858117",
	appId: "1:448544858117:web:0ca0986b99520406b5bc6c",
	measurementId: "G-492HFM1VJ8"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// 🔹 Google Authentication
const googleProvider = new GoogleAuthProvider();

// 🔹 Function to Sign in with Google
const signInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, googleProvider);
		return result.user;
	} catch (error) {
		console.error("🔥 Google Sign-In Error:", error);
		throw error;
	}
};

// 🔹 Function to Sign Out
const logout = async () => {
	try {
		await signOut(auth);
		console.log("✅ Signed out successfully.");
	} catch (error) {
		console.error("🔥 Sign Out Error:", error);
	}
};
const functions = getFunctions(app); // ✅ Add this to use Cloud Functions

// ✅ Export Firebase utilities
export {
	app, db, auth, storage,
	collection, doc, getDoc, getDocs, updateDoc, addDoc,
	createUserWithEmailAndPassword, signInWithEmailAndPassword,
	where, query, orderBy,functions,
	signOut, onAuthStateChanged,
	ref, uploadBytes, getDownloadURL,
	signInWithPopup, GoogleAuthProvider, signInWithGoogle, logout
};
