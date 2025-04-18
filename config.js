import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Constants from "expo-constants";

let auth;

// add firebase config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.appId,
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
if (typeof window !== "undefined") {
  // Web
  auth = getAuth(app);
} else {
  // React Native
  const {
    initializeAuth,
    getReactNativePersistence,
  } = require("firebase/auth");
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Authentication functions
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Firestore functions
const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    throw error;
  }
};

const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    throw error;
  }
};

const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

// Storage functions for handling media uploads
const uploadMedia = async (uri, path, metadata = {}) => {
  try {
    // Convert uri to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob, metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};

const uploadImage = async (uri, userId, propertyName, isAdmin = false) => {
  // For admin users, append datetime to allow multiple uploads
  const filename = isAdmin
    ? `images/${userId}/${propertyName}_${Date.now().toString()}`
    : `images/${userId}/${propertyName}`;
  return uploadMedia(uri, filename, { contentType: "image/jpeg" });
};

const uploadVideo = async (uri, userId, propertyName, isAdmin = false) => {
  // For admin users, append datetime to allow multiple uploads
  const filename = isAdmin
    ? `videos/${userId}/${propertyName}_${Date.now().toString()}`
    : `videos/${userId}/${propertyName}`;
  return uploadMedia(uri, filename, { contentType: "video/mp4" });
};

const deleteMedia = async (url) => {
  try {
    // Extract the path from the download URL
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

export {
  auth,
  db,
  storage,
  login,
  signup,
  logout,
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument,
  uploadMedia,
  uploadImage,
  uploadVideo,
  deleteMedia,
};
