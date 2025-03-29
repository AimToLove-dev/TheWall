import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

// Firestore functions
const getCollection = (collectionName) => {
  return db
    .collection(collectionName)
    .get()
    .then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

const getDocumentById = (collectionName, docId) => {
  return db
    .collection(collectionName)
    .doc(docId)
    .get()
    .then((docSnap) => {
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No such document!");
      }
    })
    .catch((error) => {
      throw error;
    });
};

const addDocument = (collectionName, data) => {
  return db
    .collection(collectionName)
    .add(data)
    .then((docRef) => {
      return docRef.id;
    })
    .catch((error) => {
      throw error;
    });
};

const updateDocument = (collectionName, docId, data) => {
  return db
    .collection(collectionName)
    .doc(docId)
    .update(data)
    .catch((error) => {
      throw error;
    });
};

const deleteDocument = (collectionName, docId) => {
  return db
    .collection(collectionName)
    .doc(docId)
    .delete()
    .catch((error) => {
      throw error;
    });
};

export {
  getCollection,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
};
