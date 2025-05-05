import {
  collection,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "config";

// Constants
const CONFIG_COLLECTION = "config";

/**
 * Get all more pages
 * @returns {Promise<Array>} - Array of more page documents
 */
export const getAllMorePages = async () => {
  try {
    // Query the more pages collection directly
    const morePageQuery = query(
      collection(db, CONFIG_COLLECTION),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(morePageQuery);
    const morePages = [];

    querySnapshot.forEach((doc) => {
      morePages.push({ id: doc.id, ...doc.data() });
    });

    return morePages;
  } catch (error) {
    console.error("Error getting more pages:", error);
    throw error;
  }
};

/**
 * Get a more page by ID
 * @param {string} pageId - ID of the more page
 * @returns {Promise<Object>} - More page document data
 */
export const getMorePageById = async (pageId) => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("More page not found");
    }
  } catch (error) {
    console.error("Error getting more page:", error);
    throw error;
  }
};

/**
 * Create a new more page
 * @param {Object} pageData - More page data
 * @returns {Promise<string>} - ID of the created document
 */
export const createMorePage = async (pageData) => {
  try {
    const collectionRef = collection(db, CONFIG_COLLECTION);

    // Get the current count of pages to set order
    const pages = await getAllMorePages();
    const order = pages.length;

    const docRef = await addDoc(collectionRef, {
      ...pageData,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating more page:", error);
    throw error;
  }
};

/**
 * Update an existing more page
 * @param {string} pageId - ID of the more page to update
 * @param {Object} pageData - More page data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateMorePage = async (pageId, pageData) => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, pageId);

    await updateDoc(docRef, {
      ...pageData,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating more page:", error);
    throw error;
  }
};

/**
 * Delete a more page
 * @param {string} pageId - ID of the more page to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteMorePage = async (pageId) => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, pageId);

    await deleteDoc(docRef);

    // Reorder remaining pages
    const pages = await getAllMorePages();

    const updatePromises = pages.map((page, index) => {
      return updateDoc(doc(db, CONFIG_COLLECTION, page.id), {
        order: index,
      });
    });

    await Promise.all(updatePromises);

    return true;
  } catch (error) {
    console.error("Error deleting more page:", error);
    throw error;
  }
};
