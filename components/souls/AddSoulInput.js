"use client";

import { useState } from "react";
import { TextInput, Text, Divider } from "react-native-paper";
import { submitSoulForm } from "@utils/submissionsUtils";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "components/CustomButton";

export const AddSoulForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    submitterEmail: "",
    firstName: "",
    lastName: "",
    state: "",
    city: "",
    phone: "",
    email: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    submitterEmail: false,
    firstName: false,
    lastName: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const colors = getThemeColors();

  const handleInputChange = (field, value) => {
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.submitterEmail || !emailRegex.test(formData.submitterEmail)) {
      errors.submitterEmail = true;
    }

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

    setLoading(true);
    setError("");

    try {
      const response = await submitSoulForm(formData);
      setSuccessMessage(response.message);
      onSuccess();
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while submitting the form.");
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
        Submitter Information
      </Text>
      <TextInput
        label="Your Email*"
        value={formData.submitterEmail}
        onChangeText={(text) => handleInputChange("submitterEmail", text)}
        mode="outlined"
        left={<TextInput.Icon icon="email" />}
        style={{ marginBottom: 16 }}
        keyboardType="email-address"
        outlineColor={getOutlineColor("submitterEmail")}
        outlineStyle={
          formSubmitted && validationErrors.submitterEmail
            ? { borderWidth: 2 }
            : undefined
        }
        error={formSubmitted && validationErrors.submitterEmail}
      />
      {formSubmitted && validationErrors.submitterEmail && (
        <Text
          style={{
            color: colors.error,
            fontSize: 12,
            marginTop: -14,
            marginBottom: 12,
          }}
        >
          Please enter a valid email address
        </Text>
      )}

      <Divider style={{ width: "100%", marginBottom: "2em" }} />

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Loved One's Information
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom:
            formSubmitted &&
            (validationErrors.firstName || validationErrors.lastName)
              ? 0
              : 16,
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
              style={{ color: colors.error, fontSize: 12, marginBottom: 12 }}
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
            left={<TextInput.Icon icon="account" />}
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
              style={{ color: colors.error, fontSize: 12, marginBottom: 12 }}
            >
              Required
            </Text>
          )}
        </View>
      </View>

      {!(
        formSubmitted &&
        (validationErrors.firstName || validationErrors.lastName)
      ) && <View style={{ height: 0 }} />}

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <TextInput
          label="City"
          value={formData.city}
          onChangeText={(text) => handleInputChange("city", text)}
          mode="outlined"
          left={<TextInput.Icon icon="city" />}
          style={{ flex: 1 }}
        />
        <TextInput
          label="State"
          value={formData.state}
          onChangeText={(text) => handleInputChange("state", text)}
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" />}
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
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={{ flex: 1, marginRight: 8 }}
        />
        <CustomButton
          title="Submit"
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};
