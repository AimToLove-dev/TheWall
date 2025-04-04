"use client";

import { useState } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { ErrorText, CustomInput, CustomButton } from "components";
import { getThemeColors, spacing } from "styles/theme";
import { updateUserProfile } from "utils/userUtils";

const profileValidationSchema = Yup.object().shape({
  displayName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(
      /^(\+\d{1,2}\s)?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}$/,
      "Please enter a valid phone number"
    )
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  dob: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .required("Date of birth is required"),
});

export const EditProfileForm = ({ user, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      await updateUserProfile(user.uid, values);
      if (onSuccess) {
        onSuccess(values);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        displayName: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        dob: user?.dob || "",
      }}
      validationSchema={profileValidationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleSubmit,
        handleBlur,
      }) => (
        <View style={styles.container}>
          <CustomInput
            label="Full Name"
            placeholder="Your full name"
            value={values.displayName}
            onChangeText={handleChange("displayName")}
            onBlur={handleBlur("displayName")}
            error={errors.displayName}
            touched={touched.displayName}
            leftIconName="person-outline"
          />

          <CustomInput
            label="Email"
            placeholder="Your email address"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            error={errors.email}
            touched={touched.email}
            keyboardType="email-address"
            leftIconName="mail-outline"
            editable={false} // Email is typically not editable after account creation
          />

          <CustomInput
            label="Phone Number"
            placeholder="Your phone number"
            value={values.phoneNumber}
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            error={errors.phoneNumber}
            touched={touched.phoneNumber}
            keyboardType="phone-pad"
            leftIconName="call-outline"
          />

          <CustomInput
            label="Address"
            placeholder="Your address"
            value={values.address}
            onChangeText={handleChange("address")}
            onBlur={handleBlur("address")}
            error={errors.address}
            touched={touched.address}
            leftIconName="home-outline"
          />

          <CustomInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={values.dob}
            onChangeText={handleChange("dob")}
            onBlur={handleBlur("dob")}
            error={errors.dob}
            touched={touched.dob}
            leftIconName="calendar-outline"
          />

          {error ? <ErrorText>{error}</ErrorText> : null}

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              size="medium"
              style={styles.cancelButton}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
              size="medium"
              style={styles.saveButton}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});
