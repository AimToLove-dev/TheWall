import React, { useState, useContext } from "react";
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
import { CustomInput, CustomButton, FormContainer } from "../components";
import { HeaderText, SubtitleText, ErrorText } from "../components/Typography";
import { getThemeColors, spacing } from "../styles/theme";
import { addSoul, canAddMoreSouls } from "../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../components/DatabaseErrorScreen";

const soulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  contact: Yup.string().required("Phone or email is required"),
});

export const AddSoulScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const [dbError, setDbError] = useState(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const handleAddSoul = async (values) => {
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

      // Determine if contact is email or phone
      const isEmail = values.contact.includes("@");

      // Add soul to Firestore
      await addSoul({
        name: values.name,
        ...(isEmail ? { email: values.contact } : { phone: values.contact }),
        userId: user.uid,
      });

      Alert.alert(
        "Soul Added",
        `${values.name} has been added to the Wailing Wall`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error adding soul:", error);
      if (
        error.message?.includes("Firebase") ||
        error.message?.includes("firestore")
      ) {
        setDbError(error);
      } else {
        setErrorState("Failed to add soul. Please try again.");
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
          <HeaderText>Add to Wailing Wall</HeaderText>
        </View>

        <SubtitleText style={styles.subtitle}>
          Enter the name and contact information of the person you want to add
          to the wall
        </SubtitleText>

        <Formik
          initialValues={{ name: "", contact: "" }}
          validationSchema={soulValidationSchema}
          onSubmit={handleAddSoul}
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
                title="Add to Wall"
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
