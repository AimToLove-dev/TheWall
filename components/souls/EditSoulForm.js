"use client";

import { useState, useContext } from "react";
import { TextInput, Text, Divider } from "react-native-paper";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "components/CustomButton";
import { updateSoul, deleteSoul } from "@utils/soulsUtils";
import { AuthenticatedUserContext } from "providers";
import { createDisplayName } from "@utils/index";

export const EditSoulForm = ({ soul, onSuccess, onCancel, onDelete }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: soul?.firstName || "",
    lastName: soul?.lastName || "",
    state: soul?.state || "",
    city: soul?.city || "",
  });
  const [validationErrors, setValidationErrors] = useState({
    firstName: false,
    lastName: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const colors = getThemeColors();

  // Clear messages after a timeout
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 5000); // Clear after 5 seconds
  };

  const handleInputChange = (field, value) => {
    // Clear any success/error messages when user starts typing again
    if (successMessage || error) {
      setSuccessMessage("");
      setError("");
    }

    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear validation errors when user types
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: false,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = true;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    // Clear both messages before starting submission
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const displayName = createDisplayName(
        formData.firstName,
        formData.lastName
      );

      // Update the soul with the new data
      const soulData = {
        name: displayName,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        city: formData.city || "",
        state: formData.state || "",
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

  // Helper function to get input outline color
  const getOutlineColor = (fieldName) => {
    return formSubmitted && validationErrors[fieldName]
      ? colors.error
      : undefined;
  };

  return (
    <View style={{ width: "100%" }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Edit Soul Information
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom:
            formSubmitted &&
            (validationErrors.firstName || validationErrors.lastName)
              ? 0
              : 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            label="First Name*"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            outlineColor={getOutlineColor("firstName")}
            outlineStyle={
              formSubmitted && validationErrors.firstName
                ? { borderWidth: 2 }
                : undefined
            }
            error={formSubmitted && validationErrors.firstName}
          />
          {formSubmitted && validationErrors.firstName && (
            <Text
              style={{
                color: colors.error,
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              Required
            </Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <TextInput
            label="Last Name*"
            value={formData.lastName}
            onChangeText={(text) => handleInputChange("lastName", text)}
            mode="outlined"
            left={<TextInput.Icon icon="account" forceTextInputFocus={false} />}
            outlineColor={getOutlineColor("lastName")}
            outlineStyle={
              formSubmitted && validationErrors.lastName
                ? { borderWidth: 2 }
                : undefined
            }
            error={formSubmitted && validationErrors.lastName}
          />
          {formSubmitted && validationErrors.lastName && (
            <Text
              style={{
                color: colors.error,
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              Required
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
        <TextInput
          label="City"
          value={formData.city}
          onChangeText={(text) => handleInputChange("city", text)}
          mode="outlined"
          left={<TextInput.Icon icon="city" forceTextInputFocus={false} />}
          style={{ flex: 1 }}
        />
        <TextInput
          label="State"
          value={formData.state}
          onChangeText={(text) => handleInputChange("state", text)}
          mode="outlined"
          left={
            <TextInput.Icon icon="map-marker" forceTextInputFocus={false} />
          }
          style={{ flex: 1 }}
        />
      </View>

      <Text
        style={{
          fontSize: 12,
          color: colors.text,
          marginBottom: 16,
          fontStyle: "italic",
        }}
      >
        Adding location information allows this tribute to appear on local walls
      </Text>

      {error ? (
        <Text style={{ color: colors.error, marginBottom: 16 }}>{error}</Text>
      ) : null}

      {successMessage ? (
        <Text style={{ color: colors.success, marginBottom: 16 }}>
          {successMessage}
        </Text>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomButton
          title="Delete"
          variant="error"
          onPress={handleDelete}
          style={{ flex: 1, marginRight: 8, backgroundColor: colors.error }}
          loading={loading && formData.deleting}
          disabled={loading}
        />
        <CustomButton
          title="Update"
          variant="primary"
          onPress={handleSubmit}
          loading={loading && !formData.deleting}
          disabled={loading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};
