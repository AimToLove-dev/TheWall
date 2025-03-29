"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "config";
import { Ionicons } from "@expo/vector-icons";
import { CustomInput, CustomButton, FormContainer } from "components";
import {
  HeaderText,
  SubtitleText,
  LinkText,
  ErrorText,
} from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";

const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const handleSignUp = (values) => {
    const { email, password } = values;
    setLoading(true);
    setErrorState("");

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Navigate to Dashboard after successful signup
        navigation.navigate("App", { screen: "Dashboard" });
      })
      .catch((error) => {
        setErrorState(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const renderContent = () => {
    return (
      <View style={styles.inner}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <HeaderText>Create Account</HeaderText>
          <SubtitleText>Sign up to get started</SubtitleText>
        </View>

        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={signupValidationSchema}
          onSubmit={handleSignUp}
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

              <CustomInput
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                touched={touched.password}
                secureTextEntry
                showPasswordToggle
                leftIconName="lock-closed-outline"
              />

              <CustomInput
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                secureTextEntry
                showPasswordToggle
                leftIconName="lock-closed-outline"
              />

              {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

              <CustomButton
                title="Sign Up"
                onPress={() => handleSubmit()}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.signupButton}
              />

              <View style={styles.loginContainer}>
                <SubtitleText style={styles.loginText}>
                  Already have an account?
                </SubtitleText>
                <LinkText onPress={() => navigation.navigate("Login")}>
                  {" Sign In"}
                </LinkText>
              </View>
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
  signupButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    marginBottom: 0,
  },
});
