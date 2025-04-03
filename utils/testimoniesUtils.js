import {
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from "./firebaseUtils";

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
 * Add a testimony
 * @param {Object} testimonyData - Testimony data
 * @returns {Promise<string>} - New testimony ID
 */
export const addTestimony = async (testimonyData) => {
  try {
    return await addDocument("testimonies", testimonyData);
  } catch (error) {
    console.error("Error adding testimony:", error);
    throw error;
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
  maxTestimonies = 100
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
