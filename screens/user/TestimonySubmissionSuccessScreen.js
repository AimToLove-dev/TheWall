"use client";

import React from "react";
import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View, FormContainer } from "components";
import { ConfirmationPage } from "components/testimony/ConfirmationPage";
import { getThemeColors, spacing } from "styles/theme";
import { useNavigation } from "@react-navigation/native";

export const TestimonySubmissionSuccessScreen = () => {
  const colors = getThemeColors();
  const navigation = useNavigation();

  const handleNavigateToUser = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={handleNavigateToUser}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <ConfirmationPage
        colors={colors}
        onNavigateToDashboard={handleNavigateToUser}
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginTop: spacing.sm,
    marginLeft: spacing.lg,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
