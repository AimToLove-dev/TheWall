"use client";

import { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { BodyText, CustomButton } from "components";
import { spacing } from "styles/theme";
import { sendEmailVerification } from "firebase/auth";
import { AuthenticatedUserContext } from "../../providers";

export const EmailVerificationScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

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
      borderRadius: 8,
    },
    verificationButton: {
      minWidth: 200,
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
          verification link. After verifying, you may need to sign out and sign
          back in.
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
    </View>
  );
};
