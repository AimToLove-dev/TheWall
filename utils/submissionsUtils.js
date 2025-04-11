import { auth, db, signup } from "../config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions";

const functions = getFunctions();
const submitSoulFormCallable = httpsCallable(functions, "submitSoulForm");
/**
 * Submit soul form to submissions collection
 * Uses email as document ID to enforce one submission per email
 * @param {Object} formData - Form data including submitterEmail
 * @returns {Promise<Object>} - Result object with success status and any message
 */
export const submitSoulForm = async (formData) => {
  const {
    submitterEmail,
    firstName,
    lastName,
    state = null,
    city = null,
  } = formData;

  if (!submitterEmail || !firstName || !lastName) {
    throw new Error("Email, first name, and last name are required");
  }

  const result = await submitSoulFormCallable({
    email: submitterEmail,
    firstName,
    lastName,
    state,
    city,
  });

  const { status } = result.data;

  switch (status) {
    case "submitted":
      return { success: true, message: "Form successfully submitted." };

    case "verifiedUser":
      return {
        success: false,
        message:
          "You already have an account. Please log in or reset your password.",
      };

    case "unverifiedUser":
      return {
        success: false,
        message: "Check your inbox to complete your signup.",
      };

    case "createUser":
      return {
        success: false,
        message: "You’re almost done! Check your email to set a password.",
      };

    case "duplicateSubmission":
      return {
        success: false,
        message: "You’ve already submitted. Please check your email.",
      };

    default:
      return { success: false, message: "An unknown response was received." };
  }
};
