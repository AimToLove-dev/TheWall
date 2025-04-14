"use client";

import { useState, useEffect } from "react";

import { TextInput, Text } from "react-native-paper";
import { updateUserProfile } from "@utils/profileUtils";
import { getThemeColors } from "styles/theme";
import { View } from "components";
import { CustomButton } from "components/CustomButton";

// Rename prop to profile instead of user to match what we're actually using
export const EditProfileForm = ({
  profile,
  onSuccess,
  onCancel,
  isAdminSubmission,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
    address: profile?.address || "",
    dob: profile?.dob || "",
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
  });

  const colors = getThemeColors();

  // Split displayName into firstName and lastName on component mount
  useEffect(() => {
    if (profile?.displayName) {
      const nameParts = profile.displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
      }));
    }
  }, [profile?.displayName]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // If firstName or lastName changes, update displayName
      if (field === "firstName" || field === "lastName") {
        const fullName = `${newData.firstName || ""} ${
          newData.lastName || ""
        }`.trim();
        newData.displayName = fullName;
      }

      return newData;
    });
  };

  const handleSubmit = async () => {
    if (isAdminSubmission) {
      onSuccess(formData);
      return;
    }
    // Basic validation
    if (
      !formData.displayName ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.dob
    ) {
      setError("All fields except email are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use profile.uid instead of user.uid
      await updateUserProfile(profile.uid, formData);
      onSuccess(formData);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChangeText={(text) => handleInputChange("firstName", text)}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={{ flex: 1 }}
        />
        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChangeText={(text) => handleInputChange("lastName", text)}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={{ flex: 1 }}
        />
      </View>

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        disabled={!isAdminSubmission}
        mode="outlined"
        left={<TextInput.Icon icon="email" />}
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
        mode="outlined"
        keyboardType="phone-pad"
        left={<TextInput.Icon icon="phone" />}
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange("address", text)}
        mode="outlined"
        left={<TextInput.Icon icon="home" />}
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Date of Birth (YYYY-MM-DD)"
        value={formData.dob}
        onChangeText={(text) => handleInputChange("dob", text)}
        mode="outlined"
        left={<TextInput.Icon icon="calendar" />}
        style={{ marginBottom: 16 }}
      />

      {error ? (
        <Text style={{ color: colors.error, marginBottom: 16 }}>{error}</Text>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomButton
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={{ flex: 1, marginRight: 8 }}
        />
        <CustomButton
          title="Save Changes"
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </View>
  );
};
