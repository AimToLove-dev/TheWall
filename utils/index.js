import * as Yup from "yup";
export * from "./firebaseUtils";
export * from "./soulsUtils";
export * from "./testimoniesUtils";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password must match password.")
    .required("Confirm Password is required."),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required("Please enter a registered email")
    .label("Email")
    .email("Enter a valid email"),
});

/**
 * Creates a formatted display name from first name and last initial
 * Format: "FirstName L." (e.g., "John D.")
 *
 * @param {string} firstName - The person's first name
 * @param {string} lastInitial - The person's last initial (single letter)
 * @returns {string} Formatted display name
 */
export const createDisplayName = (firstName, lastInitial) => {
  if (!firstName || !lastInitial) return "";

  const trimmedFirst = firstName.trim();
  const trimmedInitial = lastInitial.trim().charAt(0).toUpperCase();

  if (!trimmedFirst || !trimmedInitial) return "";

  return `${trimmedFirst} ${trimmedInitial}.`;
};
