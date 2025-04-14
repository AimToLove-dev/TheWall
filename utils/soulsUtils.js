import {
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  getDocumentById,
} from "./firebaseUtils";
import { auth, db, signup } from "../config";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

// Generate a random password for new user accounts
const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

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
    console.log(
      `getAllSouls called with sortBy=${sortBy}, sortDirection=${sortDirection}`
    );

    // Debug database connection
    if (!db) {
      console.error("Firestore db object is not initialized");
      return [];
    }

    // Get only allowed fields, excluding firstName and lastName
    const safeFields = [
      "name",
      "id",
      "userId",
      "email",
      "submitterEmail",
      "city",
      "state",
      "createdAt",
      "updatedAt",
      "isPublic",
      "testimonyId",
    ];

    const result = await queryDocuments(
      "souls",
      [],
      [[sortBy, sortDirection]],
      100,
      safeFields
    );

    console.log(`getAllSouls query returned ${result.length} souls`);

    // Debug first few results if any exist
    if (result.length > 0) {
      console.log("First soul:", JSON.stringify(result[0], null, 2));
    } else {
      console.log("No souls found in the database");
    }

    return result;
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
    // Get only allowed fields, excluding firstName and lastName
    const safeFields = [
      "name",
      "id",
      "userId",
      "email",
      "submitterEmail",
      "city",
      "state",
      "createdAt",
      "updatedAt",
      "isPublic",
      "testimonyId",
    ];

    return await queryDocuments(
      "souls",
      [["userId", "==", userId]],
      [[sortBy, sortDirection]],
      0,
      safeFields
    );
  } catch (error) {
    console.error(`Error getting souls for user ${userId}:`, error);
    return [];
  }
};

/**
 * Get a soul by ID
 * @param {string} soulId - Soul ID
 * @returns {Promise<Object|null>} - Soul object or null if not found
 */
export const getSoulById = async (soulId) => {
  try {
    // Only request safe fields, excluding firstName and lastName
    const docRef = doc(db, "souls", soulId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Only include allowed fields
      return {
        id: docSnap.id,
        name: data.name,
        userId: data.userId,
        email: data.email,
        submitterEmail: data.submitterEmail,
        city: data.city,
        state: data.state,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        isPublic: data.isPublic,
        testimonyId: data.testimonyId,
      };
    } else {
      throw new Error(`Document ${soulId} not found in souls`);
    }
  } catch (error) {
    console.error(`Error getting soul ${soulId}:`, error);
    return null;
  }
};

/**
 * Check if a soul has a linked testimony
 * @param {string|Object} soul - Soul ID or soul object
 * @returns {Promise<boolean>} - Whether the soul has a linked testimony
 */
export const hasLinkedTestimony = async (soul) => {
  try {
    // If we're given a soul ID, fetch the soul first
    const soulData = typeof soul === "string" ? await getSoulById(soul) : soul;

    // Check if the soul exists and has a testimonyId property
    return !!(soulData && soulData.testimonyId);
  } catch (error) {
    console.error("Error checking if soul has linked testimony:", error);
    return false;
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
    // Add testimonyId field if it doesn't exist (set to null initially)
    const dataWithTestimonyId = {
      ...soulData,
      testimonyId: soulData.testimonyId || null,
    };

    return await addDocument("souls", dataWithTestimonyId);
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
    // Check if the soul has a linked testimony
    const isLinked = await hasLinkedTestimony(soulId);

    if (isLinked) {
      throw new Error("Cannot update a soul that has a linked testimony");
    }

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
    // Check if the soul has a linked testimony
    const isLinked = await hasLinkedTestimony(soulId);

    if (isLinked) {
      throw new Error("Cannot delete a soul that has a linked testimony");
    }

    return await deleteDocument("souls", soulId);
  } catch (error) {
    console.error(`Error deleting soul ${soulId}:`, error);
    throw error;
  }
};

/**
 * Link a testimony to a soul
 * @param {string} soulId - Soul ID
 * @param {string} testimonyId - Testimony ID
 * @returns {Promise<boolean>} - Success status
 */
export const linkTestimonyToSoul = async (soulId, testimonyId) => {
  try {
    // Check if the soul already has a linked testimony
    const soul = await getSoulById(soulId);

    if (soul && soul.testimonyId && soul.testimonyId !== testimonyId) {
      throw new Error("Soul already has a different linked testimony");
    }

    // Update the soul with the testimony ID
    return await updateDocument("souls", soulId, {
      testimonyId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      `Error linking testimony ${testimonyId} to soul ${soulId}:`,
      error
    );
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

/**
 * Find souls matching the given name
 * @param {string} fullName - Full name to match
 * @returns {Promise<Array>} - Array of matching souls
 */
export const findMatchingSouls = async (fullName) => {
  try {
    // Define safe fields to retrieve (excluding firstName and lastName)
    const safeFields = [
      "name",
      "id",
      "userId",
      "email",
      "submitterEmail",
      "city",
      "state",
      "createdAt",
      "updatedAt",
      "isPublic",
      "testimonyId",
    ];

    // First try exact match
    const exactMatches = await queryDocuments(
      "souls",
      [["name", "==", fullName.trim()]],
      [],
      0,
      safeFields
    );

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // If no exact matches, get all souls and filter
    const allSouls = await getAllSouls();

    // Split the name to handle different formats
    const nameParts = fullName.trim().split(" ");
    let searchFirstName = "";
    let searchLastName = "";

    if (nameParts.length >= 2) {
      searchFirstName = nameParts[0].toLowerCase();
      searchLastName = nameParts.slice(1).join(" ").toLowerCase();
    } else {
      searchFirstName = fullName.toLowerCase();
    }

    return allSouls.filter((soul) => {
      const soulNameLower = soul.name.toLowerCase();
      const fullNameLower = fullName.toLowerCase();

      // Check for inclusion in either direction
      if (
        soulNameLower.includes(fullNameLower) ||
        fullNameLower.includes(soulNameLower)
      ) {
        return true;
      }

      // Check for name part matches using the soul's name (not firstName/lastName)
      const soulParts = soul.name.toLowerCase().split(" ");
      const soulFirstPart = soulParts[0];
      const soulLastPart =
        soulParts.length > 1 ? soulParts.slice(1).join(" ") : "";

      return (
        (soulFirstPart.includes(searchFirstName) ||
          searchFirstName.includes(soulFirstPart)) &&
        (soulLastPart.includes(searchLastName) ||
          searchLastName.includes(soulLastPart))
      );
    });
  } catch (error) {
    console.error("Error finding matching souls:", error);
    return [];
  }
};
