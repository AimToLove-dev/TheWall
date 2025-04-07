import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton } from "components";
import { HeaderText, SubtitleText, BodyText } from "components/Typography";
import { spacing } from "styles/theme";

export const ProfileIncomplete = ({
  missingFields,
  colors,
  onCompleteProfile,
  onBack,
}) => {
  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.incompleteProfileContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={80}
          color={colors.warning}
        />
        <HeaderText style={styles.incompleteTitle}>
          Profile Incomplete
        </HeaderText>
        <SubtitleText style={styles.incompleteSubtitle}>
          Please complete your profile before submitting a testimony
        </SubtitleText>

        <View style={styles.missingFieldsContainer}>
          <BodyText style={styles.missingFieldsTitle}>
            Missing information:
          </BodyText>
          {missingFields.map((field, index) => (
            <View key={index} style={styles.missingFieldRow}>
              <Ionicons
                name="close-circle-outline"
                size={16}
                color={colors.error}
              />
              <BodyText style={styles.missingFieldText}>
                {field === "displayName"
                  ? "Full Name"
                  : field === "phoneNumber"
                  ? "Phone Number"
                  : field === "dob"
                  ? "Date of Birth"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </BodyText>
            </View>
          ))}
        </View>

        <CustomButton
          title="Complete Your Profile"
          onPress={onCompleteProfile}
          variant="primary"
          size="large"
          style={styles.completeProfileButton}
          leftIcon={
            <Ionicons name="person-outline" size={20} color="#FFFFFF" />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  incompleteProfileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  incompleteTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  incompleteSubtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  missingFieldsContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  missingFieldsTitle: {
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  missingFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  missingFieldText: {
    marginLeft: spacing.xs,
  },
  completeProfileButton: {
    width: "100%",
    maxWidth: 400,
  },
});
