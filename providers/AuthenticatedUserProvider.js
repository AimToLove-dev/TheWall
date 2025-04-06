"use client";

import { useState, createContext, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config";

export const AuthenticatedUserContext = createContext({
  user: null,
  setUser: () => {},
  profile: null,
  refreshProfile: () => {},
  updateProfile: () => {},
});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: null,
    displayName: "",
    email: "",
    emailVerified: null,
    phoneNumber: "",
    address: "",
    dob: "",
    isAnonymous: null,
    isAdmin: false,
  });

  const [profile, setProfile] = useState(null);

  // Function to fetch user profile data from Firestore
  const refreshProfile = async () => {
    if (user && user.uid) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          setProfile(profileData);

          // Update user state with profile data
          setUser((prevUser) => ({
            ...prevUser,
            ...profileData,
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  // Function to update user profile in Firestore
  const updateProfile = async (profileData) => {
    if (user && user.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            ...profileData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        // Update local state
        setUser((prevUser) => ({
          ...prevUser,
          ...profileData,
        }));

        // Refresh profile
        await refreshProfile();

        return true;
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    }
    return false;
  };

  // Refresh profile when user changes
  useEffect(() => {
    if (user?.uid) {
      // Add null check here
      refreshProfile();
    }
  }, [user?.uid]); // Change dependency to include null check

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        profile,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
