"use client";

import { useState, createContext, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config";

export const AuthenticatedUserContext = createContext({
  user: null,
  setUser: () => {},
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
      }
    }
  }, [user?.email, user?.emailVerified, user?.uid]);

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        isEmailVerified,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
