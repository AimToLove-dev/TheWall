"use client";

import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthenticatedUserContext } from "providers";
import { auth } from "config";
import { Ionicons } from "@expo/vector-icons";
import { CustomInput, CustomButton, FormContainer } from "components";
import {
  HeaderText,
  SubtitleText,
  LinkText,
  ErrorText,
} from "@components/common/Typography";
import { getThemeColors, spacing } from "styles/theme";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const LoginScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  useEffect(() => {
    if (user) {
      navigation.replace("User");
    }
  }, []);

  const handleLogin = (values) => {
    const { email, password } = values;
    setLoading(true);
    setErrorState("");

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const isVerified = result.user.emailVerified;

        // Check if user is from aimtolove.com domain and verified
        if (
          result.user.email.toLowerCase().endsWith("@aimtolove.com") &&
          isVerified &&
          result.user?.uid
        ) {
          navigation.reset({
            index: 0,
            routes: [{ name: "User", params: { screen: "DashboardAdmin" } }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "User" }],
          });
        }
      })
      .catch((error) => {
        let errorMessage = "An error occurred during login";
        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage = "Invalid email or password";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection";
          case "auth/user-not-admin":
            errorMessage = "Login is admin only";
            break;
        }
        setErrorState(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSignUp = () => {
    navigation.navigate("Signup");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
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

        <View style={styles.logoContainer}>
          <HeaderText>Welcome back!</HeaderText>
          <SubtitleText>Sign in to continue</SubtitleText>
        </View>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
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

              {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

              <View style={styles.forgotPasswordContainer}>
                <LinkText onPress={handleForgotPassword}>
                  Forgot Password?
                </LinkText>
              </View>

              <CustomButton
                title="Sign In"
                onPress={() => handleSubmit()}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.loginButton}
              />

              <View style={styles.signupContainer}>
                <SubtitleText style={styles.signupText}>
                  Don't have an account?
                </SubtitleText>
                <LinkText onPress={handleSignUp}>{" Sign Up"}</LinkText>
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
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#5A67F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    marginBottom: 0,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#F0F0F0",
  },
  submitButton: {
    marginVertical: 25,
    height: 50,
    justifyContent: "center",
  },
});
