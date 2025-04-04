import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config";

/**
 * Update a user's profile in Firestore
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
    throw error;
  }
};

/**
 * Check if a user's profile is complete
 * @param {Object} user - User object
 * @returns {Object} - Object with isComplete flag and missing fields
 */
export const checkProfileCompleteness = (user) => {
  if (!user) {
    return { isComplete: false, missingFields: ["all"] };
  }

  const requiredFields = [
    "displayName",
    "email",
    "phoneNumber",
    "address",
    "dob",
  ];
  const missingFields = requiredFields.filter((field) => !user[field]);

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
};
