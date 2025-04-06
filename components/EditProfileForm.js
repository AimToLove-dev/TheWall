"use client";

import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { updateUserProfile } from "utils/userUtils";

export const EditProfileForm = ({ user, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    dob: user?.dob || "",
  });

  const theme = useTheme();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
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
      await updateUserProfile(user.uid, formData);
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
      <TextInput
        label="Full Name"
        value={formData.displayName}
        onChangeText={(text) => handleInputChange("displayName", text)}
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Email"
        value={formData.email}
        disabled={true}
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
        <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
          {error}
        </Text>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={{ flex: 1, marginRight: 8 }}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={{ flex: 1, marginLeft: 8 }}
        >
          Save Changes
        </Button>
      </View>
    </View>
  );
};
