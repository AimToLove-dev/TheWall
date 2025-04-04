import {
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from "./firebaseUtils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload a file to Firebase Storage
 * @param {string} uri - Local URI of the file
 * @param {string} path - Storage path
 * @returns {Promise<string>} - Download URL
 */
export const uploadFile = async (uri, path) => {
  try {
    // Get the file extension
    const extension = uri.split(".").pop();

    // Create a reference to the file location
    const storage = getStorage();
    const storageRef = ref(storage, path);

    // Fetch the file
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload the file
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Submit a testimony with media files
 * @param {Object} testimonyData - Testimony data
 * @param {string} beforeImageUri - Local URI of before image
 * @param {string} afterImageUri - Local URI of after image
 * @param {string} videoUri - Local URI of video
 * @returns {Promise<string>} - New testimony ID
 */
export const submitTestimony = async (
  testimonyData,
  beforeImageUri,
  afterImageUri,
  videoUri
) => {
  try {
    const userId = testimonyData.userId;
    const timestamp = new Date().getTime();

    // Upload media files if provided
    const uploadPromises = [];
    let beforeImageUrl = null;
    let afterImageUrl = null;
    let videoUrl = null;

    if (beforeImageUri) {
      const beforePromise = uploadFile(
        beforeImageUri,
        `testimonies/${userId}/before_${timestamp}.jpg`
      ).then((url) => {
        beforeImageUrl = url;
      });
      uploadPromises.push(beforePromise);
    }

    if (afterImageUri) {
      const afterPromise = uploadFile(
        afterImageUri,
        `testimonies/${userId}/after_${timestamp}.jpg`
      ).then((url) => {
        afterImageUrl = url;
      });
      uploadPromises.push(afterPromise);
    }

    if (videoUri) {
      const videoPromise = uploadFile(
        videoUri,
        `testimonies/${userId}/video_${timestamp}.mp4`
      ).then((url) => {
        videoUrl = url;
      });
      uploadPromises.push(videoPromise);
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Add testimony document with media URLs
    const completeTestimonyData = {
      ...testimonyData,
      beforeImage: beforeImageUrl,
      afterImage: afterImageUrl,
      video: videoUrl,
      status: "pending", // Pending approval
      submittedAt: new Date().toISOString(),
    };

    return await addDocument("testimonies", completeTestimonyData);
  } catch (error) {
    console.error("Error submitting testimony:", error);
    throw error;
  }
};

/**
 * Get all testimonies
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of testimonies
 */
export const getAllTestimonies = async (
  sortBy = "createdAt",
  sortDirection = "desc"
) => {
  try {
    return await queryDocuments("testimonies", [], [[sortBy, sortDirection]]);
  } catch (error) {
    console.error("Error getting all testimonies:", error);
    return [];
  }
};

/**
 * Get testimonies by user ID
 * @param {string} userId - User ID
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of testimonies for the user
 */
export const getUserTestimonies = async (
  userId,
  sortBy = "createdAt",
  sortDirection = "desc"
) => {
  try {
    return await queryDocuments(
      "testimonies",
      [["userId", "==", userId]],
      [[sortBy, sortDirection]]
    );
  } catch (error) {
    console.error(`Error getting testimonies for user ${userId}:`, error);
    return [];
  }
};

/**
 * Count user's testimonies
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of testimonies for the user
 */
export const countUserTestimonies = async (userId) => {
  try {
    const testimonies = await getUserTestimonies(userId);
    return testimonies.length;
  } catch (error) {
    console.error(`Error counting testimonies for user ${userId}:`, error);
    return 0;
  }
};

/**
 * Update a testimony
 * @param {string} testimonyId - Testimony ID
 * @param {Object} testimonyData - Updated testimony data
 * @returns {Promise<boolean>} - Success status
 */
export const updateTestimony = async (testimonyId, testimonyData) => {
  try {
    return await updateDocument("testimonies", testimonyId, testimonyData);
  } catch (error) {
    console.error(`Error updating testimony ${testimonyId}:`, error);
    throw error;
  }
};

/**
 * Delete a testimony
 * @param {string} testimonyId - Testimony ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTestimony = async (testimonyId) => {
  try {
    return await deleteDocument("testimonies", testimonyId);
  } catch (error) {
    console.error(`Error deleting testimony ${testimonyId}:`, error);
    throw error;
  }
};

/**
 * Check if user can add more testimonies
 * @param {string} userId - User ID
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {number} maxTestimonies - Maximum number of testimonies allowed
 * @returns {Promise<boolean>} - Whether the user can add more testimonies
 */
export const canAddMoreTestimonies = async (
  userId,
  isAdmin = false,
  maxTestimonies = 1
) => {
  try {
    if (isAdmin) return true;

    const count = await countUserTestimonies(userId);
    return count < maxTestimonies;
  } catch (error) {
    console.error(
      `Error checking if user ${userId} can add more testimonies:`,
      error
    );
    // Default to true to prevent blocking users from adding testimonies
    return true;
  }
};
