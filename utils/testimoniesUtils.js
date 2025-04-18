import {
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  getDocumentById,
  setDocumentWithId,
} from "./firebaseUtils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { linkTestimonyToSoul as linkSoulTestimonyRecord } from "./soulsUtils";

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
 * Submit a testimony with media files to the testimonySubmissions collection
 * @param {Object} testimonyData - Testimony data
 * @param {string} beforeImageUri - Local URI of before image
 * @param {string} afterImageUri - Local URI of after image
 * @param {string} videoUri - Local URI of video
 * @param {string} soulId - ID of the soul this testimony is connected to (optional)
 * @returns {Promise<string>} - New testimony submission ID
 */
export const submitTestimony = async (testimonyData) => {
  try {
    const userEmail = testimonyData.userEmail;

    // Add testimony document with media URLs and soul ID to testimonySubmissions collection
    const completeTestimonyData = {
      ...testimonyData,
      submittedAt: new Date().toISOString(),
    };

    // Check if user is admin
    const isAdmin = testimonyData.isAdmin === true;

    if (isAdmin) {
      // For admins, continue to use auto-generated IDs
      return await addDocument("testimonySubmissions", completeTestimonyData);
    } else {
      // For regular users, use their email as the document ID to enforce one submission per user
      if (!userEmail) {
        throw new Error("User email is required to submit a testimony");
      }
      return await setDocumentWithId(
        "testimonySubmissions",
        userEmail,
        completeTestimonyData
      );
    }
  } catch (error) {
    console.error("Error submitting testimony:", error);
    throw error;
  }
};

/**
 * Link a testimony submission to a soul
 * @param {string} testimonyId - Testimony ID
 * @param {string} soulId - Soul ID
 * @returns {Promise<boolean>} - Success status
 */
export const linkTestimonyToSoulRecord = async (testimonyId, soulId) => {
  try {
    // Update the testimony with the soul ID
    await updateDocument("testimonySubmissions", testimonyId, {
      soulId,
      updatedAt: new Date().toISOString(),
    });

    // Also update the soul with the testimony ID
    await linkSoulTestimonyRecord(soulId, testimonyId);

    return true;
  } catch (error) {
    console.error(
      `Error linking testimony ${testimonyId} to soul ${soulId}:`,
      error
    );
    throw error;
  }
};

/**
 * Get all published testimonies from the public testimonies collection
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of testimonies
 */
export const getAllTestimonies = async (
  sortBy = "createdAt",
  sortDirection = "desc"
) => {
  try {
    const testimonies = await queryDocuments(
      "testimonies",
      [],
      [[sortBy, sortDirection]],
      100
    );
    console.log("Fetched testimonies:", testimonies);
    return testimonies;
  } catch (error) {
    console.error("Error getting all testimonies:", error);
    return [];
  }
};

/**
 * Get all testimony submissions that an admin can review
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of testimony submissions
 */
export const getAllTestimonySubmissions = async (
  sortBy = "submittedAt",
  sortDirection = "desc"
) => {
  try {
    return await queryDocuments(
      "testimonySubmissions",
      [],
      [[sortBy, sortDirection]]
    );
  } catch (error) {
    console.error("Error getting testimony submissions:", error);
    return [];
  }
};

/**
 * Get user's testimony submissions
 * @param {string} userId - User ID
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of testimony submissions for the user
 */
export const getUserTestimonySubmissions = async (
  userId,
  sortBy = "submittedAt",
  sortDirection = "desc"
) => {
  try {
    return await queryDocuments(
      "testimonySubmissions",
      [["userId", "==", userId]],
      [[sortBy, sortDirection]]
    );
  } catch (error) {
    console.error(
      `Error getting testimony submissions for user ${userId}:`,
      error
    );
    return [];
  }
};

/**
 * Get user's public testimony from the testimonies collection
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - First testimony found for the user or null if not found
 */
export const getUserTestimony = async (userId) => {
  try {
    const results = await queryDocuments("testimonies", [
      ["userId", "==", userId],
    ]);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error(`Error getting public testimony for user ${userId}:`, error);
    return null;
  }
};

/**
 * Get user's testimony submissions
 * @param {string} userId - User ID
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of testimony submissions for the user
 */
export const getUserTestimonyArchive = async (userId) => {
  try {
    return await queryDocuments("testimonyArchive", [["userId", "==", userId]]);
  } catch (error) {
    console.error(
      `Error getting testimony submissions for user ${userId}:`,
      error
    );
    return [];
  }
};

/**
 * Get a testimony submission by ID
 * @param {string} testimonyId - Testimony ID
 * @returns {Promise<Object|null>} - Testimony object or null if not found
 */
export const getTestimonyById = async (testimonyId) => {
  try {
    // Use getDocumentById instead of queryDocuments for direct document lookup
    return await getDocumentById("testimonySubmissions", testimonyId);
  } catch (error) {
    console.error(`Error getting testimony submission ${testimonyId}:`, error);
    return null;
  }
};

/**
 * Get a specific testimony submission by user ID and testimony ID
 * @param {string} userId - User ID
 * @param {string} testimonyId - Testimony ID (optional)
 * @returns {Promise<Object|null>} - Testimony object or null if not found
 */
export const getUserTestimonyById = async (userId, testimonyId = null) => {
  try {
    // If testimonyId is provided, find that specific testimony
    if (testimonyId) {
      const testimony = await getTestimonyById(testimonyId);
      // Return the testimony only if it belongs to the user
      return testimony && testimony.userId === userId ? testimony : null;
    }

    // If no testimonyId is provided, get the most recent testimony for this user
    const testimonies = await getUserTestimonySubmissions(
      userId,
      "submittedAt",
      "desc"
    );
    return testimonies.length > 0 ? testimonies[0] : null;
  } catch (error) {
    console.error(`Error getting testimony for user ${userId}:`, error);
    return null;
  }
};

/**
 * Count user's testimony submissions
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of testimonies for the user
 */
export const countUserTestimonies = async (userId) => {
  try {
    const testimonies = await getUserTestimonySubmissions(userId);
    return testimonies.length;
  } catch (error) {
    console.error(`Error counting testimonies for user ${userId}:`, error);
    return 0;
  }
};

/**
 * Update a testimony submission
 * @param {string} testimonyId - Testimony ID
 * @param {Object} testimonyData - Updated testimony data
 * @returns {Promise<boolean>} - Success status
 */
export const updateTestimony = async (testimonyId, testimonyData) => {
  try {
    // Add updated timestamp
    const updatedData = {
      ...testimonyData,
      updatedAt: new Date().toISOString(),
    };

    return await updateDocument(
      "testimonySubmissions",
      testimonyId,
      updatedData
    );
  } catch (error) {
    console.error(`Error updating testimony ${testimonyId}:`, error);
    throw error;
  }
};

/**
 * Delete a testimony submission
 * @param {string} testimonyId - Testimony ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTestimony = async (testimonyId) => {
  try {
    return await deleteDocument("testimonySubmissions", testimonyId);
  } catch (error) {
    console.error(`Error deleting testimony ${testimonyId}:`, error);
    throw error;
  }
};

/**
 * After admin review, approve a testimony submission by copying it to the public testimonies collection
 * and deleting it from testimonySubmissions
 * @param {string} submissionId - Testimony submission ID
 * @returns {Promise<string>} - New published testimony ID
 */
export const approveAndPublishTestimony = async (submissionId) => {
  try {
    // Get the submission
    const submission = await getDocumentById(
      "testimonySubmissions",
      submissionId
    );
    if (!submission) {
      throw new Error(`Testimony submission ${submissionId} not found`);
    }

    // Add it to the public testimonies collection
    const publicTestimonyId = await addDocument("testimonies", {
      ...submission,
      approvedAt: new Date().toISOString(),
    });

    // Delete it from the submissions collection
    await deleteDocument("testimonySubmissions", submissionId);

    return publicTestimonyId;
  } catch (error) {
    console.error(`Error publishing testimony ${submissionId}:`, error);
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
