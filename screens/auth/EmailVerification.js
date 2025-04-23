"use client";

import { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { useTheme } from "react-native-paper";
import { BodyText, CustomButton } from "components";
import { spacing } from "styles/theme";
import { sendEmailVerification, signOut } from "firebase/auth";
import { AuthenticatedUserContext } from "../../providers";
import { auth } from "config";
import { useNavigation } from "@react-navigation/native";

export const EmailVerificationScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBackToLogin, setShowBackToLogin] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (verificationSent) {
      const timer = setTimeout(() => {
        setShowBackToLogin(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [verificationSent]);

  const handleSendVerification = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Use Linking to navigate back to login, which will reload the app and refresh auth data
    Linking.openURL("/login");
  };

  const handleCancelVerification = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const styles = StyleSheet.create({
    verificationContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: spacing.xl,
      justifyContent: "center",
      alignItems: "center",
    },
    verificationTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: spacing.lg,
      textAlign: "center",
    },
    verificationText: {
      fontSize: 16,
      marginBottom: spacing.xl,
      textAlign: "center",
      lineHeight: 24,
    },
    verificationSuccess: {
      fontSize: 16,
      color: "green",
      textAlign: "center",
      lineHeight: 24,
      padding: spacing.md,
      backgroundColor: "rgba(0,255,0,0.1)",
    },
    verificationButton: {
      minWidth: 200,
      marginBottom: spacing.md,
    },
    backToLoginButton: {
      minWidth: 200,
      marginTop: spacing.lg,
    },
    cancelButton: {
      minWidth: 200,
      marginTop: spacing.md,
    },
  });

  return (
    <View style={styles.verificationContainer}>
      <BodyText style={styles.verificationTitle}>
        Email Verification Required
      </BodyText>
      <BodyText style={styles.verificationText}>
        Please verify your email address at {user?.email} to access this area.
      </BodyText>
      {verificationSent ? (
        <BodyText style={styles.verificationSuccess}>
          Verification email sent! Please check your inbox and click the
          verification link.
        </BodyText>
      ) : (
        <CustomButton
          title="Send Verification Email"
          variant="primary"
          onPress={handleSendVerification}
          loading={loading}
          style={styles.verificationButton}
        />
      )}
      {showBackToLogin && (
        <CustomButton
          title="Back to Login"
          variant="primary"
          onPress={handleBackToLogin}
          style={styles.backToLoginButton}
        />
      )}
      <CustomButton
        title="Cancel"
        variant="outline"
        onPress={handleCancelVerification}
        style={styles.cancelButton}
      />
    </View>
  );
};
