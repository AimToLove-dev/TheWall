import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderText, SubtitleText } from "./Typography";
import { spacing } from "../styles/theme";

export const DashboardHeader = ({
  title,
  subtitle,
  onBackPress,
  onSignOutPress,
  colors,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={onBackPress}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <HeaderText style={styles.title}>{title}</HeaderText>
        <SubtitleText style={styles.subtitle}>{subtitle}</SubtitleText>
      </View>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={onSignOutPress}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
