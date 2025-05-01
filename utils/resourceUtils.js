import {
  collection,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "config";

// Constants
const RESOURCES_COLLECTION = "resources";
const SETTINGS_DOC_ID = "settings";

// URL validation for Google Drive folder
const isValidGoogleDriveURL = (url) => {
  if (!url) return false;

  // Check if it's a Google Drive URL
  const googleDriveRegex =
    /^https:\/\/drive\.google\.com\/(drive\/folders\/|file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
  return googleDriveRegex.test(url);
};

/**
 * Get the resources settings document
 * @returns {Promise<Object>} - Settings document data
 */
export const getResourceSettings = async () => {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Initialize with default settings if not exists
      const defaultSettings = {
        googleDriveFolderUrl: "",
        lastUpdated: null,
      };
      await setDoc(docRef, {
        ...defaultSettings,
        createdAt: serverTimestamp(),
      });
      return { id: SETTINGS_DOC_ID, ...defaultSettings };
    }
  } catch (error) {
    console.error("Error getting resource settings:", error);
    throw error;
  }
};

/**
 * Update the resources settings document
 * @param {Object} data - Settings data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateResourceSettings = async (data) => {
  try {
    // Validate Google Drive URL if provided
    if (
      data.googleDriveFolderUrl &&
      !isValidGoogleDriveURL(data.googleDriveFolderUrl)
    ) {
      throw new Error("Invalid Google Drive folder URL");
    }

    const docRef = doc(db, RESOURCES_COLLECTION, SETTINGS_DOC_ID);
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
    console.error("Error updating resource settings:", error);
    throw error;
  }
};

/**
 * Validate if a Google Drive folder URL is valid and accessible
 * @param {string} url - Google Drive folder URL to validate
 * @returns {Promise<Object>} - Validation result with status and message
 */
export const validateGoogleDriveURL = async (url) => {
  try {
    // First check format
    if (!isValidGoogleDriveURL(url)) {
      return {
        isValid: false,
        message: "Invalid Google Drive URL format",
      };
    }

    // In a real implementation, you would check if the folder is public and accessible
    // This would typically involve making an API call to Google Drive
    // For now, we'll simulate this with a basic check

    // Check if URL contains "folders" for folder sharing
    if (url.includes("drive/folders/")) {
      return {
        isValid: true,
        message: "Google Drive folder URL is valid",
      };
    } else {
      return {
        isValid: false,
        message: "URL must be a Google Drive folder (not a file)",
      };
    }
  } catch (error) {
    console.error("Error validating Google Drive URL:", error);
    return {
      isValid: false,
      message: "Error validating URL: " + error.message,
    };
  }
};
