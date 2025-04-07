import { doc, setDoc } from "firebase/firestore";
import { db } from "../config";

/**
 * Update a user's profile in Firestore
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<boolean>}
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "profiles", userId);
    await setDoc(
      userRef,
      {
        ...profileData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
    throw error;
  }
};

/**
 * Check if a user's profile is complete
 * @param {Object} profile - Profile object
 * @returns {Object} - Object with isComplete flag and missing fields
 */
export const checkProfileCompleteness = (profile) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "dob",
  ];
  const missingFields = requiredFields.filter((field) => !profile?.[field]);

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
};

export const createUserProfile = async (user) => {
  // Copy Firebase auth data to profile
  const profileData = {
    uid: user.uid,
    email: user.email,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    createdAt: new Date(),
    // Add additional profile fields with empty values
    phoneNumber: "",
    address: "",
    dob: "",
    isAdmin: false,
  };

  // Save to 'profiles' collection
  await firebase
    .firestore()
    .collection("profiles")
    .doc(user.uid)
    .set(profileData);
  return profileData;
};

// Add this after other exports
export const getFullName = (profile) => {
  if (!profile) return "";
  return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
};

export const getInitials = (profile) => {
  if (!profile) return "";
  const first = profile.firstName?.charAt(0) || "";
  const last = profile.lastName?.charAt(0) || "";
  return (first + last).toUpperCase();
};
