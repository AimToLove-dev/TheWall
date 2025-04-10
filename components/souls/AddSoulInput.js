"use client";

import { useState } from "react";
import { TextInput, Text } from "react-native-paper";
import { addSoul } from "@utils/soulsUtils";
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user types
    if (formSubmitted && validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      submitterEmail: !formData.submitterEmail,
      firstName: !formData.firstName,
      lastName: !formData.lastName,
    };

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.submitterEmail && !emailRegex.test(formData.submitterEmail)) {
      errors.submitterEmail = true;
    }

    setValidationErrors(errors);

    return !Object.values(errors).some((isError) => isError);
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);

    if (!validateForm()) {
      setError("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addSoul(formData);
      setSuccessMessage(
        "Soul added successfully! Please check your email for verification."
      );
      onSuccess(formData);
    } catch (err) {
      setError("Failed to add soul. Please try again.");
      console.error("Error adding soul:", err);
      if (onCancel) onCancel(err);
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
        Submitter Email (required)
      </Text>
      <TextInput
        label="Your Email (required)"
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

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Loved One's Name (required)
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
            label="Loved One's First Name"
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
            label="Loved One's Last Name"
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

      <Text style={{ fontWeight: "bold", marginBottom: 8, marginTop: 8 }}>
        Loved One's Locale (Optional)
      </Text>

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

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Loved One's Contact (Optional)
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        <TextInput
          label="Loved One's Phone"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          mode="outlined"
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
          style={{ flex: 1 }}
        />

        <TextInput
          label="Loved One's Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          keyboardType="email-address"
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
        Contact information helps notify you if a testimony is submitted for
        your loved one
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
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </View>
  );
};
