// filepath: d:\sources\TheWall\components\dashboard\AdminFunctionButton.js
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BodyText } from "@components/common/Typography";
import { getThemeColors, spacing } from "styles/theme";

export const AdminFunctionButton = ({
  title,
  description,
  iconName,
  onPress,
  colors = getThemeColors(),
}) => {
  return (
    <TouchableOpacity style={styles.adminButton} onPress={onPress}>
      <View style={styles.adminIconContainer}>
        <Ionicons name={iconName} size={24} color={colors.primary} />
      </View>
      <View style={styles.adminButtonText}>
        <BodyText style={styles.adminButtonTitle}>{title}</BodyText>
        <BodyText style={styles.adminButtonDescription}>{description}</BodyText>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  adminIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  adminButtonText: {
    flex: 1,
  },
  adminButtonTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  adminButtonDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
});
