import {
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from "./firebaseUtils";

/**
 * Get all souls
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of souls
 */
export const getAllSouls = async (
  sortBy = "createdAt",
  sortDirection = "desc"
) => {
  try {
    return await queryDocuments("souls", [], [[sortBy, sortDirection]]);
  } catch (error) {
    console.error("Error getting all souls:", error);
    return [];
  }
};

/**
 * Get souls by user ID
 * @param {string} userId - User ID
 * @param {string} sortBy - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @returns {Promise<Array>} - Array of souls for the user
 */
export const getUserSouls = async (
  userId,
  sortBy = "createdAt",
  sortDirection = "desc"
) => {
  try {
    return await queryDocuments(
      "souls",
      [["userId", "==", userId]],
      [[sortBy, sortDirection]]
    );
  } catch (error) {
    console.error(`Error getting souls for user ${userId}:`, error);
    return [];
  }
};

/**
 * Count user's souls
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of souls for the user
 */
export const countUserSouls = async (userId) => {
  try {
    const souls = await getUserSouls(userId);
    return souls.length;
  } catch (error) {
    console.error(`Error counting souls for user ${userId}:`, error);
    return 0;
  }
};

/**
 * Add a soul
 * @param {Object} soulData - Soul data
 * @returns {Promise<string>} - New soul ID
 */
export const addSoul = async (soulData) => {
  try {
    return await addDocument("souls", soulData);
  } catch (error) {
    console.error("Error adding soul:", error);
    throw error;
  }
};

/**
 * Update a soul
 * @param {string} soulId - Soul ID
 * @param {Object} soulData - Updated soul data
 * @returns {Promise<boolean>} - Success status
 */
export const updateSoul = async (soulId, soulData) => {
  try {
    return await updateDocument("souls", soulId, soulData);
  } catch (error) {
    console.error(`Error updating soul ${soulId}:`, error);
    throw error;
  }
};

/**
 * Delete a soul
 * @param {string} soulId - Soul ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteSoul = async (soulId) => {
  try {
    return await deleteDocument("souls", soulId);
  } catch (error) {
    console.error(`Error deleting soul ${soulId}:`, error);
    throw error;
  }
};

/**
 * Check if user can add more souls
 * @param {string} userId - User ID
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {number} maxSouls - Maximum number of souls allowed
 * @returns {Promise<boolean>} - Whether the user can add more souls
 */
export const canAddMoreSouls = async (
  userId,
  isAdmin = false,
  maxSouls = 7
) => {
  try {
    if (isAdmin) return true;

    const count = await countUserSouls(userId);
    return count < maxSouls;
  } catch (error) {
    console.error(
      `Error checking if user ${userId} can add more souls:`,
      error
    );
    // Default to true to prevent blocking users from adding souls
    return true;
  }
};
