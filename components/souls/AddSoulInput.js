"use client";

import { useState, useContext } from "react";
import { TextInput, Text, Divider } from "react-native-paper";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "components/CustomButton";
import { addSoul } from "@utils/soulsUtils";
import { AuthenticatedUserContext } from "providers";
import { doc, setDoc } from "firebase/firestore";
import { db } from "config";

export const AddSoulForm = ({ onSuccess, onCancel }) => {
  const { user, isEmailVerified } = useContext(AuthenticatedUserContext);
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

    // Email validation - only if user is not authenticated
    if (!isAuthenticated) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !formData.submitterEmail ||
        !emailRegex.test(formData.submitterEmail)
      ) {
        errors.submitterEmail = true;
      }
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

    // Clear both messages before starting submission
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const displayName = `${formData.firstName.trim()} ${formData.lastName
        .trim()
        .charAt(0)
        .toUpperCase()}.`;
      let soulId;

      // Path 1: User is logged in and email is verified
      if (isAuthenticated) {
        // Call the soulUtils/addSoul function with proper data
        const soulData = {
          name: displayName,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          userId: user.uid,
          email: user.email, // Using the logged-in user's email
          city: formData.city || "",
          state: formData.state || "",
          createdAt: new Date().toISOString(),
          isPublic: false,
        };

        soulId = await addSoul(soulData);
      }
      // Path 2: Anonymous submission or user's email not verified
      else {
        // Use direct document creation with email as document ID
        // This follows the security rule: documentId == request.resource.data.email
        const soulData = {
          name: displayName,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.submitterEmail,
          submitterEmail: formData.submitterEmail,
          city: formData.city || "",
          state: formData.state || "",
          createdAt: new Date().toISOString(),
          isPublic: false,
          testimonyId: null, // Add this to match the addSoul function's expectations
        };

        // For anonymous users, use submitterEmail as document ID
        // to satisfy the security rule requirement
        const soulRef = doc(db, "souls", formData.submitterEmail);
        await setDoc(soulRef, soulData);
        soulId = formData.submitterEmail;
      }

      // Show success message
      setSuccessMessage("Soul added successfully!");
      clearMessages(); // Start timeout to clear messages

      // Reset form
      setFormData({
        submitterEmail: "",
        firstName: "",
        lastName: "",
        state: "",
        city: "",
        phone: "",
        email: "",
      });

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

  // Helper function to get input outline color
  const getOutlineColor = (fieldName) => {
    return formSubmitted && validationErrors[fieldName]
      ? colors.error
      : undefined;
  };

  return (
    <View style={{ width: "100%" }}>
      {!error?.toLowerCase().includes("login") && (
        <>
          {!isAuthenticated && (
            <>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                Submitter Information
              </Text>
              <TextInput
                label="Your Email*"
                value={formData.submitterEmail}
                onChangeText={(text) =>
                  handleInputChange("submitterEmail", text)
                }
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
            Adding location information allows this tribute to appear on local
            walls
          </Text>
        </>
      )}

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
    </View>
  );
};
