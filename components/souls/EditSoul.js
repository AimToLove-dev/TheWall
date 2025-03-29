"use client";

import { useState, useContext } from "react";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { View } from "../View";
import { AuthenticatedUserContext } from "../../providers";
import { CustomInput, CustomButton } from "../";
import { SubtitleText, ErrorText } from "../Typography";
import { ScreenHeader } from "../ScreenHeader";
import { CustomDialog } from "../CustomDialog";
import { getThemeColors, spacing } from "../../styles/theme";
import { updateSoul } from "../../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../DatabaseErrorScreen";

const soulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  contact: Yup.string().required("Phone or email is required"),
});

export const EditSoul = ({ soul, onSuccess, onCancel }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const [dbError, setDbError] = useState(null);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [updatedSoul, setUpdatedSoul] = useState(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Get initial contact value (either email or phone)
  const initialContact = soul.email || soul.phone || "";

  const handleUpdateSoul = async (values) => {
    if (!user) {
      setErrorState("You must be logged in to update a soul");
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      // Determine if contact is email or phone
      const isEmail = values.contact.includes("@");

      // Update soul data
      const soulData = {
        name: values.name,
        ...(isEmail
          ? { email: values.contact, phone: null }
          : { phone: values.contact, email: null }),
      };

      // Update soul in Firestore
      await updateSoul(soul.id, soulData);

      setUpdatedSoul({ id: soul.id, ...soulData });
      setSuccessDialogVisible(true);
    } catch (error) {
      console.error("Error updating soul:", error);
      if (
        error.message?.includes("Firebase") ||
        error.message?.includes("firestore")
      ) {
        setDbError(error);
      } else {
        setErrorState("Failed to update soul. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setSuccessDialogVisible(false);
    if (onSuccess && updatedSoul) {
      onSuccess(updatedSoul);
    }
  };

  // If there's a database error, show the database error screen
  if (dbError) {
    return (
      <DatabaseErrorScreen onRetry={() => setDbError(null)} error={dbError} />
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Soul" showBackButton={false} />

      <SubtitleText style={styles.subtitle}>
        Update the information for this soul
      </SubtitleText>

      <Formik
        initialValues={{
          name: soul.name || "",
          contact: initialContact,
        }}
        validationSchema={soulValidationSchema}
        onSubmit={handleUpdateSoul}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <View
            style={[
              styles.formContainer,
              isLargeScreen && styles.formContainerLarge,
            ]}
          >
            <CustomInput
              label="Name"
              placeholder="Enter name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={errors.name}
              touched={touched.name}
              leftIconName="person-outline"
            />

            <CustomInput
              label="Phone or Email"
              placeholder="Enter phone or email"
              value={values.contact}
              onChangeText={handleChange("contact")}
              onBlur={handleBlur("contact")}
              error={errors.contact}
              touched={touched.contact}
              leftIconName="call-outline"
            />

            {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

            <View style={styles.buttonContainer}>
              {onCancel && (
                <CustomButton
                  title="Cancel"
                  onPress={onCancel}
                  variant="outline"
                  size="large"
                  style={styles.cancelButton}
                />
              )}

              <CustomButton
                title="Update"
                onPress={() => handleSubmit()}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.submitButton}
              />
            </View>
          </View>
        )}
      </Formik>

      <CustomDialog
        visible={successDialogVisible}
        title="Soul Updated"
        message={`${
          updatedSoul?.name || "Soul"
        }'s information has been updated`}
        confirmText="OK"
        onConfirm={handleSuccessConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: "100%",
  },
  formContainerLarge: {
    maxWidth: 500,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  cancelButton: {
    marginRight: spacing.md,
    borderRadius: 12,
    flex: 1,
  },
  submitButton: {
    borderRadius: 12,
    flex: 1,
  },
});
