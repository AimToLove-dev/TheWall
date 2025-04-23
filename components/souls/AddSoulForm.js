"use client";

import { useState, useContext } from "react";
import { TextInput, Text, Divider } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "components/CustomButton";
import { addSoul } from "@utils/soulsUtils";
import { AuthenticatedUserContext } from "providers";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "config";
import { createDisplayName } from "@utils/index";
import { useNavigation } from "@react-navigation/native";

// Button state enum - frozen object for immutability
const ButtonState = Object.freeze({
  SUBMIT: "submit",
  LOGIN: "login",
  SIGNUP: "signup",
});

// Hash email function to create consistent anonymous IDs
const hashEmail = (email) => {
  // Simple string hashing function that creates a consistent hash
  let hash = 0;
  if (!email || email.length === 0) return hash;

  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Prefix with 'anon_' to identify as anonymous submission
  return `anon_${Math.abs(hash).toString(16)}`;
};

// Validation schema for the form
const soulValidationSchema = Yup.object().shape({
  submitterEmail: Yup.string().when("isAuthenticated", {
    is: false,
    then: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required")
      .trim(),
    otherwise: Yup.string().notRequired(), // Explicitly make it not required when authenticated
  }),
  firstName: Yup.string().required("First name is required"),
  lastInitial: Yup.string()
    .required("Last initial is required")
    .matches(/^[A-Za-z]$/, "Only enter a single letter")
    .max(1, "Only enter a single letter"),
  state: Yup.string()
    .matches(/^[A-Z]{2}$/, "State code is 2 letters")
    .notRequired(),
  city: Yup.string().notRequired(),
});

export const AddSoulForm = ({ onSuccess, onCancel }) => {
  const { user, isEmailVerified } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonState, setButtonState] = useState(ButtonState.SUBMIT);

  const navigation = useNavigation();

  // Check if user is authenticated and email is verified
  const isAuthenticated = user && isEmailVerified;

  const colors = getThemeColors();

  // Clear messages after a timeout
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 5000); // Clear after 5 seconds
  };

  const handleSubmit = async (values, { resetForm }) => {
    // Clear both messages before starting submission
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setButtonState(ButtonState.SUBMIT); // Reset button state

    try {
      const displayName = createDisplayName(
        values.firstName,
        values.lastInitial
      );
      let soulId;

      // Path 1: User is logged in and email is verified
      if (isAuthenticated) {
        // Call the soulUtils/addSoul function with proper data
        const soulData = {
          name: displayName,
          userId: user.uid,
          city: values.city || "",
          state: values.state || "",
          createdAt: new Date().toISOString(),
        };

        soulId = await addSoul(soulData);
      }
      // Path 2: Anonymous submission or user's email not verified
      else {
        // Ensure we have a valid email
        if (!values.submitterEmail || values.submitterEmail.trim() === "") {
          setError("Email is required for anonymous submissions");
          setLoading(false);
          return;
        }

        // Hash the email to create a consistent document ID for this email
        const emailHash = hashEmail(values.submitterEmail.toLowerCase().trim());

        // Store only necessary data (no PII)
        const soulData = {
          name: displayName,
          city: values.city || "",
          state: values.state || "",
          createdAt: new Date().toISOString(),
          testimonyId: null,
        };

        // Use the hashed email as document ID to enforce one submission per email
        const soulRef = doc(db, "souls", emailHash);

        // Check if this email has already submitted
        const existingDoc = await getDoc(soulRef);
        if (existingDoc.exists()) {
          setError(
            "Only one submission per email address is allowed. Please create an account to add more."
          );
          setButtonState(ButtonState.SIGNUP);
          setLoading(false);
          return;
        }

        await setDoc(soulRef, soulData);
        soulId = emailHash;
      }

      // Reset form after successful submission
      resetForm();

      // Show success message
      setSuccessMessage("Soul added successfully!");
      clearMessages(); // Start timeout to clear messages

      // Call success callback if provided
      if (onSuccess) {
        onSuccess({
          id: soulId,
          name: displayName,
          // Include other data as needed
        });
      }
    } catch (error) {
      console.error("Error adding soul:", error);
      // Clear success message if there was one and set error
      setSuccessMessage("");

      if (error.message.toLowerCase().includes("permission")) {
        setError("Only 1 anonymous submission allowed. Please login.");
        setButtonState(ButtonState.LOGIN);
      } else {
        setError(error.message || "Failed to add soul. Please try again.");
      }

      clearMessages(); // Start timeout to clear messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <Formik
        initialValues={{
          submitterEmail: "",
          firstName: "",
          lastInitial: "",
          state: "",
          city: "",
          isAuthenticated: isAuthenticated, // Used for conditional validation
        }}
        validationSchema={soulValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true} // Add this to ensure form reinitializes when auth state changes
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Hide form fields if login/signup button is shown */}
            {buttonState === ButtonState.SUBMIT && (
              <>
                {!isAuthenticated && (
                  <>
                    <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                      Submitter Information
                    </Text>
                    <TextInput
                      label="Your Email*"
                      value={values.submitterEmail}
                      onChangeText={handleChange("submitterEmail")}
                      onBlur={handleBlur("submitterEmail")}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon="email"
                          forceTextInputFocus={false}
                        />
                      }
                      style={{ marginBottom: 16 }}
                      keyboardType="email-address"
                      error={touched.submitterEmail && errors.submitterEmail}
                    />
                    {touched.submitterEmail && errors.submitterEmail && (
                      <Text
                        style={{
                          color: colors.error,
                          fontSize: 12,
                          marginTop: -14,
                          marginBottom: 12,
                        }}
                      >
                        {errors.submitterEmail}
                      </Text>
                    )}

                    <Divider style={{ width: "100%", marginBottom: "2em" }} />
                  </>
                )}

                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                  LGBTQ+ Friend or Family Member
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom:
                      (touched.firstName && errors.firstName) ||
                      (touched.lastInitial && errors.lastInitial)
                        ? 0
                        : 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <TextInput
                      label="First Name*"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      mode="outlined"
                      left={<TextInput.Icon icon="account" />}
                      error={touched.firstName && errors.firstName}
                    />
                    {touched.firstName && errors.firstName && (
                      <Text
                        style={{
                          color: colors.error,
                          fontSize: 12,
                          marginBottom: 12,
                        }}
                      >
                        {errors.firstName}
                      </Text>
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <TextInput
                      label="Last Initial*"
                      value={values.lastInitial}
                      onChangeText={(text) => {
                        // Only allow a single letter and automatically convert to uppercase
                        if (text.length <= 1) {
                          handleChange("lastInitial")(text.toUpperCase());
                        }
                      }}
                      onBlur={handleBlur("lastInitial")}
                      mode="outlined"
                      maxLength={1}
                      placeholder="D"
                      left={<TextInput.Icon icon="account" />}
                      error={touched.lastInitial && errors.lastInitial}
                    />
                    {touched.lastInitial && errors.lastInitial && (
                      <Text
                        style={{
                          color: colors.error,
                          fontSize: 12,
                          marginBottom: 12,
                        }}
                      >
                        {errors.lastInitial}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      label="City"
                      value={values.city}
                      onChangeText={handleChange("city")}
                      onBlur={handleBlur("city")}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon="city"
                          forceTextInputFocus={false}
                        />
                      }
                      style={{ flex: 1 }}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <TextInput
                      label="State"
                      value={values.state}
                      onChangeText={(text) => {
                        handleChange("state")(text.toUpperCase());
                      }}
                      onBlur={handleBlur("state")}
                      mode="outlined"
                      placeholder="CA"
                      placeholderTextColor={colors.placeholderText}
                      error={touched.state && errors.state}
                      left={
                        <TextInput.Icon
                          icon="map-marker"
                          forceTextInputFocus={false}
                        />
                      }
                      style={{ flex: 1 }}
                    />
                    {touched.state && errors.state && (
                      <Text
                        style={{
                          color: colors.error,
                          fontSize: 12,
                          marginBottom: 12,
                        }}
                      >
                        {errors.state}
                      </Text>
                    )}
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 12,
                    color: colors.text,
                    marginBottom: 16,
                    fontStyle: "italic",
                  }}
                >
                  Adding location information allows this tribute to appear on
                  local walls
                </Text>
              </>
            )}

            {error ? (
              <Text style={{ color: colors.error, marginBottom: 16 }}>
                {error}
              </Text>
            ) : null}

            {successMessage ? (
              <Text style={{ color: colors.success, marginBottom: 16 }}>
                {successMessage}
              </Text>
            ) : null}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={onCancel}
                style={{ flex: 1, marginRight: 8 }}
              />
              {buttonState === ButtonState.LOGIN ? (
                <CustomButton
                  title="Login"
                  variant="primary"
                  onPress={() => navigation.navigate("login")}
                  style={{ flex: 1 }}
                />
              ) : buttonState === ButtonState.SIGNUP ? (
                <CustomButton
                  title="Sign Up"
                  variant="primary"
                  onPress={() =>
                    navigation.navigate("Auth", { screen: "Signup" })
                  }
                  style={{ flex: 1 }}
                />
              ) : (
                <CustomButton
                  title="Submit"
                  variant="primary"
                  onPress={() => handleSubmit()} // Explicitly call it as a function
                  loading={loading}
                  disabled={loading}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};
