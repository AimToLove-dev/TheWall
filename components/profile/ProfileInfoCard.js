"use client";

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderText, BodyText } from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import { getFullName } from "@utils/profileUtils";

// Create a component to display profile information during testimony submission
const ProfileInfoCard = ({ profileData, isAdmin, onEditProfile }) => {
  const colors = getThemeColors();

  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <HeaderText style={styles.profileCardTitle}>
          Profile Information
        </HeaderText>
        <TouchableOpacity
          onPress={onEditProfile}
          style={styles.editProfileButton}
        >
          <Ionicons name="pencil" size={20} color={colors.primary} />
          <BodyText style={styles.editProfileText}>Edit</BodyText>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContent}>
        <View style={styles.profileRow}>
          <BodyText style={styles.profileLabel}>Name:</BodyText>
          <BodyText style={styles.profileValue}>
            {getFullName(profileData) || "Not provided"}
          </BodyText>
        </View>

        <View style={styles.profileRow}>
          <BodyText style={styles.profileLabel}>Email:</BodyText>
          <BodyText style={styles.profileValue}>
            {profileData.email || "Not provided"}
          </BodyText>
        </View>

        <View style={styles.profileRow}>
          <BodyText style={styles.profileLabel}>Phone:</BodyText>
          <BodyText style={styles.profileValue}>
            {profileData.phoneNumber || "Not provided"}
          </BodyText>
        </View>

        <View style={styles.profileRow}>
          <BodyText style={styles.profileLabel}>Address:</BodyText>
          <BodyText style={styles.profileValue}>
            {profileData.address || "Not provided"}
          </BodyText>
        </View>

        <View style={styles.profileRow}>
          <BodyText style={styles.profileLabel}>Date of Birth:</BodyText>
          <BodyText style={styles.profileValue}>
            {profileData.dob || "Not provided"}
          </BodyText>
        </View>

        {isAdmin && (
          <View style={styles.adminNoteContainer}>
            <BodyText style={styles.adminNote}>
              You are submitting this testimony as an admin on behalf of this
              person.
            </BodyText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: spacing.sm,
  },
  profileCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editProfileText: {
    marginLeft: 5,
    color: "#4CAF50",
  },
  profileContent: {
    marginTop: spacing.sm,
  },
  profileRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  profileLabel: {
    width: 100,
    fontWeight: "bold",
    opacity: 0.7,
  },
  profileValue: {
    flex: 1,
  },
  adminNoteContainer: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderRadius: 4,
  },
  adminNote: {
    fontStyle: "italic",
    fontSize: 14,
    color: "#ff8f00",
  },
});

export { ProfileInfoCard };
