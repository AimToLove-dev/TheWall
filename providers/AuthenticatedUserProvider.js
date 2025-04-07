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
  isEmailVerified: false,
});

export const AuthenticatedUserProvider = ({ children }) => {
  // Core user state (auth data)
  const [user, setUser] = useState({
    uid: null,
    email: "",
    emailVerified: null,
    isAnonymous: null,
    isAdmin: false,
  });

  // Profile state (user profile data)
  const [profile, setProfile] = useState({
    uid: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
  });

  // Email verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Check if user email is verified
  useEffect(() => {
    if (user?.email) {
      // Check if email is verified
      const isVerified = user.emailVerified === true;
      setIsEmailVerified(isVerified);

      // Set admin status only if from aimtolove.com domain AND email is verified
      if (
        user.email.toLowerCase().endsWith("@aimtolove.com") &&
        isVerified &&
        user?.uid
      ) {
        setUser((prevUser) => ({
          ...prevUser,
          isAdmin: true,
        }));

        // Update the profile in Firestore to set isAdmin flag
        const updateAdminStatus = async () => {
          try {
            await setDoc(
              doc(db, "profiles", user.uid),
              {
                isAdmin: true,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (error) {
            console.error("Error updating admin status:", error);
          }
        };

        updateAdminStatus();
      }
    } else {
      setIsEmailVerified(false);
    }
  }, [user?.email, user?.emailVerified, user?.uid]);

  // Function to fetch user profile data from Firestore
  const refreshProfile = async () => {
    if (user?.uid) {
      try {
        const userDoc = await getDoc(doc(db, "profiles", user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          // Merge profile data, giving priority to core user fields
          setProfile({
            ...profileData,
            uid: user.uid,
            email: user.email || profileData.email, // Prefer auth email
          });

          // If the user has a verified @aimtolove.com email, make sure isAdmin is true in profile
          if (
            user.email &&
            user.email.toLowerCase().endsWith("@aimtolove.com") &&
            user.emailVerified === true &&
            !profileData.isAdmin
          ) {
            await setDoc(
              doc(db, "profiles", user.uid),
              {
                isAdmin: true,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );

            // Update local profile state
            setProfile((prev) => ({
              ...prev,
              isAdmin: true,
            }));
          }
        } else {
          // If no profile exists, create one with basic user data
          const isAimToLoveDomain =
            user.email &&
            user.email.toLowerCase().endsWith("@aimtolove.com") &&
            user.emailVerified === true;
          const initialProfile = {
            uid: user.uid,
            email: user.email,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            address: "",
            dob: "",
            isAdmin: isAimToLoveDomain, // Set admin status based on verified email domain
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, "profiles", user.uid), initialProfile);
          setProfile(initialProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  // Function to update user profile in Firestore
  const updateProfile = async (profileData) => {
    if (user?.uid) {
      try {
        // Don't allow updating core user fields through profile
        const sanitizedProfileData = {
          ...profileData,
          uid: user.uid, // Ensure UID matches
          email: user.email, // Keep auth email
        };

        // Preserve admin status if user has verified @aimtolove.com email
        if (
          user.email &&
          user.email.toLowerCase().endsWith("@aimtolove.com") &&
          user.emailVerified === true
        ) {
          sanitizedProfileData.isAdmin = true;
        }

        await setDoc(
          doc(db, "profiles", user.uid),
          {
            ...sanitizedProfileData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        // Update local profile state
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...sanitizedProfileData,
        }));

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
      refreshProfile();
    } else {
      // Reset profile when user is null
      setProfile({
        uid: null,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dob: "",
      });
    }
  }, [user?.uid]);

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        profile,
        refreshProfile,
        updateProfile,
        isEmailVerified,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
