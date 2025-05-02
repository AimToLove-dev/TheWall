import {
  collection,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "config";

// Constants
const CONFIG_COLLECTION = "config";
const SETTINGS_DOC_ID = "settings";

/**
 * Get the config settings document
 * @returns {Promise<Object>} - Settings document data
 */
export const getConfigSettings = async () => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Initialize with empty settings if not exists
      const defaultSettings = {
        lastUpdated: null,
      };
      await setDoc(docRef, {
        ...defaultSettings,
        createdAt: serverTimestamp(),
      });
      return { id: SETTINGS_DOC_ID, ...defaultSettings };
    }
  } catch (error) {
    console.error("Error getting config settings:", error);
    throw error;
  }
};

/**
 * Update the config settings document
 * @param {Object} data - Settings data to update (any key-value pairs)
 * @returns {Promise<boolean>} - Success status
 */
export const updateConfigSettings = async (data) => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(
      docRef,
      {
        ...data,
        lastUpdated: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error updating config settings:", error);
    throw error;
  }
};
