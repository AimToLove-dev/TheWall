import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderText, BodyText } from "components/Typography";
import { CustomButton } from "components";
import { spacing } from "styles/theme";

export const ConfirmationPage = ({ colors, onNavigateToDashboard }) => {
  return (
    <View style={styles.confirmationContainer}>
      <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      <HeaderText style={styles.confirmationTitle}>
        Testimony Submitted!
      </HeaderText>
      <BodyText style={styles.confirmationText}>
        Thank you for sharing your testimony. It has been submitted for review.
        Once approved, it will appear on The Wall.
      </BodyText>
      <CustomButton
        title="Return to Dashboard"
        variant="primary"
        onPress={onNavigateToDashboard}
        style={styles.confirmationButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  confirmationTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  confirmationText: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  confirmationButton: {
    width: "100%",
    maxWidth: 400,
  },
});
