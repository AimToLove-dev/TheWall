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
 * Creates a formatted display name from first and last name
 * Format: "FirstName LastInitial." (e.g., "John D.")
 *
 * @param {string} firstName - The person's first name
 * @param {string} lastName - The person's last name
 * @returns {string} Formatted display name
 */
export const createDisplayName = (firstName, lastName) => {
  if (!firstName || !lastName) return "";

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();

  if (!trimmedFirst || !trimmedLast) return "";

  return `${trimmedFirst} ${trimmedLast.charAt(0).toUpperCase()}.`;
};
