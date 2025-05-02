"use client";

import { useState } from "react";
import { TextInput, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "@components/common/CustomButton";
import { addSoul } from "@utils/soulsUtils";
import { createDisplayName } from "@utils/index";

// Validation schema for the form
const soulValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .test("no-profanity", "Inappropriate language is not allowed", (value) => {
      if (!value) return true;
      // List of common swear words to check against
      const swearWords = [
        "fuck",
        "shit",
        "bitch",
        "cunt",
        "damn",
        "dick",
        "pussy",
      ];

      // Check for standalone "ass" using word boundary regex
      const containsAss = /\bass\b/i.test(value);

      return (
        !swearWords.some((word) => value.toLowerCase().includes(word)) &&
        !containsAss
      );
    }),
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      const displayName = createDisplayName(
        values.firstName,
        values.lastInitial
      );

      // Call the soulUtils/addSoul function with proper data
      const soulData = {
        name: displayName,
        firstName: values.firstName.trim(),
        lastInitial: values.lastInitial.trim(),
        city: values.city || "",
        state: values.state || "",
        createdAt: new Date().toISOString(),
      };

      // Let Firebase auto-generate the document ID
      const soulId = await addSoul(soulData);

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
      setError(error.message || "Failed to add soul. Please try again.");
      clearMessages(); // Start timeout to clear messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <Formik
        initialValues={{
          firstName: "",
          lastInitial: "",
          state: "",
          city: "",
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
                    <TextInput.Icon icon="city" forceTextInputFocus={false} />
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
              Adding location information allows this tribute to appear on local
              walls
            </Text>

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
              <CustomButton
                title="Submit"
                variant="primary"
                onPress={() => handleSubmit()}
                loading={loading}
                disabled={loading}
                style={{ flex: 1 }}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};
