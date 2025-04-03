import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "config" // Updated import path

/**
 * Generic Firestore utility functions
 */

/**
 * Check if Firestore is initialized
 * @returns {boolean} - Whether Firestore is initialized
 */
const isFirestoreInitialized = () => {
  return db && typeof db.collection === "function"
}

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} - Array of documents with IDs
 */
export const getCollection = async (collectionName) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firebase is not initialized. Check your configuration.")
    }

    const querySnapshot = await getDocs(collection(db, collectionName))
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return data
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

/**
 * Get a document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} - Document data with ID
 */
export const getDocumentById = async (collectionName, docId) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firebase is not initialized. Check your configuration.")
    }

    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error(`Document ${docId} not found in ${collectionName}`)
    }
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Add a document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Document data
 * @returns {Promise<string>} - New document ID
 */
export const addDocument = async (collectionName, data) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firebase is not initialized. Check your configuration.")
    }

    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw error
  }
}

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Updated data
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firebase is not initialized. Check your configuration.")
    }

    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firebase is not initialized. Check your configuration.")
    }

    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Query documents with filters
 * @param {string} collectionName - Name of the collection
 * @param {Array} filters - Array of filter conditions [field, operator, value]
 * @param {Array} orderByFields - Array of fields to order by [field, direction]
 * @param {number} limitCount - Number of documents to limit to
 * @returns {Promise<Array>} - Array of documents with IDs
 */
export const queryDocuments = async (collectionName, filters = [], orderByFields = [], limitCount = 0) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firebase is not initialized. Check your configuration.")
    }

    let q = collection(db, collectionName)

    // Add filters
    if (filters.length > 0) {
      const queryConstraints = filters.map((filter) => {
        const [field, operator, value] = filter
        return where(field, operator, value)
      })
      q = query(q, ...queryConstraints)
    }

    // Add orderBy
    if (orderByFields.length > 0) {
      orderByFields.forEach((orderByField) => {
        const [field, direction = "asc"] = orderByField
        q = query(q, orderBy(field, direction))
      })
    }

    // Add limit
    if (limitCount > 0) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return data
  } catch (error) {
    console.error(`Error querying collection ${collectionName}:`, error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

