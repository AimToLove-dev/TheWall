"use client";

import { useState, useContext } from "react";
import { StyleSheet, useColorScheme, View as RNView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthenticatedUserContext } from "../../providers";
import { CustomInput, CustomButton } from "../";
import { ErrorText } from "../Typography";
import { getThemeColors, spacing } from "../../styles/theme";
import { addSoul, canAddMoreSouls } from "../../utils/firebaseUtils";
import { Ionicons } from "@expo/vector-icons";

const soulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export const AddSoul = ({ onSuccess, onCancel }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const handleAddSoul = async (values, { resetForm }) => {
    if (!user) {
      setErrorState("You must be logged in to add a soul");
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      // Check if user can add more souls
      const canAdd = await canAddMoreSouls(user.uid, user.isAdmin);

      if (!canAdd) {
        setErrorState("You have reached the maximum limit of 7 souls");
        setLoading(false);
        return;
      }

      // Add soul to Firestore with just the name for now
      const soulData = {
        name: values.name,
        userId: user.uid,
        isPublic: true, // Default to public
      };

      const soulId = await addSoul(soulData);

      // Reset the form
      resetForm();

      // Call onSuccess with the new soul data
      if (onSuccess) {
        onSuccess({ id: soulId, ...soulData });
      }
    } catch (error) {
      console.error("Error adding soul:", error);
      setErrorState("Failed to add soul. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: "" }}
      validationSchema={soulValidationSchema}
      onSubmit={handleAddSoul}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <RNView style={styles.container}>
          <RNView style={styles.inputContainer}>
            <CustomInput
              placeholder="Enter name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={errors.name}
              touched={touched.name}
              leftIconName="person-outline"
              containerStyle={styles.input}
            />

            <CustomButton
              title="Add"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
              size="medium"
              style={styles.addButton}
              leftIcon={<Ionicons name="add" size={18} color="#FFFFFF" />}
            />
          </RNView>

          {errorState !== "" && (
            <ErrorText style={styles.error}>{errorState}</ErrorText>
          )}

          {onCancel && (
            <CustomButton
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              size="small"
              style={styles.cancelButton}
            />
          )}
        </RNView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    marginRight: spacing.sm,
    marginBottom: 0,
  },
  addButton: {
    marginTop: 22, // To align with input when it has a label
  },
  error: {
    marginTop: spacing.xs,
    marginLeft: 0,
  },
  cancelButton: {
    marginTop: spacing.xs,
    alignSelf: "flex-start",
  },
});
