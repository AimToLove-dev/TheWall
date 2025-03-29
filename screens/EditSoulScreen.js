"use client";

import { useState, useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { View } from "../components/View";
import { AuthenticatedUserContext } from "../providers";
import { CustomInput, CustomButton } from "../components";
import { HeaderText, SubtitleText, ErrorText } from "../components/Typography";
import { getThemeColors, spacing } from "../styles/theme";
import { updateSoul } from "../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../components/DatabaseErrorScreen";

const soulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  contact: Yup.string().required("Phone or email is required"),
});

export const EditSoulScreen = ({ navigation, route }) => {
  const { soul } = route.params;
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const [dbError, setDbError] = useState(null);
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

      // Update soul in Firestore
      await updateSoul(soul.id, {
        name: values.name,
        ...(isEmail
          ? { email: values.contact, phone: null }
          : { phone: values.contact, email: null }),
      });

      Alert.alert(
        "Soul Updated",
        `${values.name}'s information has been updated`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
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

  // If there's a database error, show the database error screen
  if (dbError) {
    return (
      <DatabaseErrorScreen
        onRetry={() => setDbError(null)}
        error={dbError}
        navigation={navigation}
      />
    );
  }

  return (
    <View
      isSafe
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.content, isLargeScreen && styles.contentLarge]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: isDark ? colors.card : "transparent" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <HeaderText>Edit Soul</HeaderText>
        </View>

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

              <CustomButton
                title="Update"
                onPress={() => handleSubmit()}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  contentLarge: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
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
  submitButton: {
    marginTop: spacing.lg,
    borderRadius: 12,
  },
});
