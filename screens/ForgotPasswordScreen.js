"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../config";
import { CustomInput, CustomButton, FormContainer } from "../components";
import { HeaderText, SubtitleText, ErrorText } from "../components/Typography";
import { getThemeColors, spacing } from "../styles/theme";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

export const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const handleResetPassword = (values) => {
    const { email } = values;
    setLoading(true);
    setErrorState("");

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Password Reset Email Sent",
          "Check your email for a password reset link",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      })
      .catch((error) => {
        setErrorState(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderContent = () => {
    return (
      <View style={styles.inner}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <HeaderText>Forgot Password</HeaderText>
          <SubtitleText>
            Enter your email to receive a password reset link
          </SubtitleText>
        </View>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleResetPassword}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <View style={styles.formContainer}>
              <CustomInput
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                leftIconName="mail-outline"
              />

              {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

              <CustomButton
                title="Send Reset Link"
                onPress={() => handleSubmit()}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.resetButton}
              />
            </View>
          )}
        </Formik>
      </View>
    );
  };

  return (
    <FormContainer
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.contentContainer}
    >
      {renderContent()}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: spacing.lg,
  },
  inner: {
    flex: 1,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#F0F0F0",
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  resetButton: {
    marginTop: spacing.md,
  },
});
