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
import { doc, setDoc } from "firebase/firestore";
import { db } from "config";
import { createDisplayName } from "@utils/index";

// Validation schema for the form
const soulValidationSchema = Yup.object().shape({
  submitterEmail: Yup.string().when("isAuthenticated", {
    is: false,
    then: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    otherwise: Yup.string(),
  }),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  state: Yup.string().matches(/^[A-Z]{2}$/, "State code is 2 letters"),
  city: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email("Please enter a valid email"),
});

export const AddSoulForm = ({ onSuccess, onCancel }) => {
  const { user, isEmailVerified } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    try {
      const displayName = createDisplayName(values.firstName, values.lastName);
      let soulId;

      // Path 1: User is logged in and email is verified
      if (isAuthenticated) {
        // Call the soulUtils/addSoul function with proper data
        const soulData = {
          name: displayName,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          userId: user.uid,
          email: user.email, // Using the logged-in user's email
          city: values.city || "",
          state: values.state || "",
          createdAt: new Date().toISOString(),
        };

        soulId = await addSoul(soulData);
      }
      // Path 2: Anonymous submission or user's email not verified
      else {
        // Use direct document creation with email as document ID
        // This follows the security rule: documentId == request.resource.data.email
        const soulData = {
          name: displayName,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.submitterEmail,
          submitterEmail: values.submitterEmail,
          city: values.city || "",
          state: values.state || "",
          createdAt: new Date().toISOString(),
          testimonyId: null, // Add this to match the addSoul function's expectations
        };

        // For anonymous users, use submitterEmail as document ID
        // to satisfy the security rule requirement
        const soulRef = doc(db, "souls", values.submitterEmail);
        await setDoc(soulRef, soulData);
        soulId = values.submitterEmail;
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
          lastName: "",
          state: "",
          city: "",
          phone: "",
          email: "",
          isAuthenticated: isAuthenticated, // Used for conditional validation
        }}
        validationSchema={soulValidationSchema}
        onSubmit={handleSubmit}
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
            {!error?.toLowerCase().includes("login") && (
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
                  Loved One's Information
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom:
                      (touched.firstName && errors.firstName) ||
                      (touched.lastName && errors.lastName)
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
                      label="Last Name*"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      mode="outlined"
                      left={<TextInput.Icon icon="account" />}
                      error={touched.lastName && errors.lastName}
                    />
                    {touched.lastName && errors.lastName && (
                      <Text
                        style={{
                          color: colors.error,
                          fontSize: 12,
                          marginBottom: 12,
                        }}
                      >
                        {errors.lastName}
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
                  Last Names are abbreviated publicly to protect privacy
                </Text>

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
              {error?.toLowerCase().includes("login") ? (
                <CustomButton
                  title="Login"
                  variant="primary"
                  onPress={() => navigation.navigate("login")}
                  style={{ flex: 1 }}
                />
              ) : (
                <CustomButton
                  title="Submit"
                  variant="primary"
                  onPress={handleSubmit}
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
