"use client";

import { useState, createContext, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config";

export const AuthenticatedUserContext = createContext({
  user: null,
  setUser: () => {},
  profile: null,
  refreshProfile: () => {},
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

  // Refresh profile when user changes
  useEffect(() => {
    refreshProfile();
  }, [user.uid]);

  return (
    <AuthenticatedUserContext.Provider
      value={{ user, setUser, profile, refreshProfile }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
