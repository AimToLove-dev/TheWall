"use client";

import { useState, useContext } from "react";
import { TextInput, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "components/CustomButton";
import { updateSoul, deleteSoul } from "@utils/soulsUtils";
import { AuthenticatedUserContext } from "providers";
import { createDisplayName } from "@utils/index";

// Validation schema for the form
const soulValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastInitial: Yup.string()
    .required("Last initial is required")
    .matches(/^[A-Za-z]$/, "Only enter a single letter")
    .max(1, "Only enter a single letter"),
  state: Yup.string().matches(/^[A-Z]{2}$/, "State code is 2 letters"),
  city: Yup.string(),
});

export const EditSoulForm = ({ soul, onSuccess, onCancel, onDelete }) => {
  const { user } = useContext(AuthenticatedUserContext);
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

  const handleSubmit = async (values) => {
    // Clear both messages before starting submission
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const displayName = createDisplayName(
        values.firstName,
        values.lastInitial
      );

      // Update the soul with the new data
      const soulData = {
        name: displayName,
        firstName: values.firstName.trim(),
        lastInitial: values.lastInitial.trim(),
        city: values.city || "",
        state: values.state || "",
        updatedAt: new Date().toISOString(),
      };

      await updateSoul(soul.id, soulData);

      // Show success message
      setSuccessMessage("Soul updated successfully!");
      clearMessages(); // Start timeout to clear messages

      // Call success callback if provided
      if (onSuccess) {
        onSuccess({
          ...soul,
          ...soulData,
        });
      }
    } catch (error) {
      console.error("Error updating soul:", error);
      setSuccessMessage("");
      if (error.message.toLowerCase().includes("linked testimony")) {
        setError("Cannot update a soul that has a linked testimony.");
      } else {
        setError(error.message || "Failed to update soul. Please try again.");
      }
      clearMessages(); // Start timeout to clear messages
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await deleteSoul(soul.id);

      // Call delete callback if provided
      if (onDelete) {
        onDelete(soul.id);
      }
    } catch (error) {
      console.error("Error deleting soul:", error);
      if (error.message.toLowerCase().includes("linked testimony")) {
        setError("Cannot delete a soul that has a linked testimony.");
      } else {
        setError(error.message || "Failed to delete soul. Please try again.");
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
          firstName: soul?.firstName || "",
          lastInitial: soul?.lastInitial || "",
          state: soul?.state || "",
          city: soul?.city || "",
        }}
        validationSchema={soulValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
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
              Edit Soul Information
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
                  left={
                    <TextInput.Icon
                      icon="account"
                      forceTextInputFocus={false}
                    />
                  }
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
                    <TextInput.Icon icon="city" forceTextInputFocus={false} />
                  }
                  style={{ flex: 1 }}
                />
                {touched.city && errors.city && (
                  <Text
                    style={{
                      color: colors.error,
                      fontSize: 12,
                      marginBottom: 12,
                    }}
                  >
                    {errors.city}
                  </Text>
                )}
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
                title="Delete"
                variant="error"
                onPress={handleDelete}
                style={{
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: colors.error,
                }}
                loading={loading && values.deleting}
                disabled={loading}
              />
              <CustomButton
                title="Update"
                variant="primary"
                onPress={handleSubmit}
                loading={loading && !values.deleting}
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
