"use client";

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { HelperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { BodyText } from "components/Typography";
import { getThemeColors } from "styles/theme";
import { spacing } from "styles/theme";

export const CheckboxInput = ({
  label,
  options = ["Yes", "No"],
  value,
  onChange,
  error,
  required = false,
  style,
  ...props
}) => {
  const colors = getThemeColors();

  // Check if we should show an error (only show if required, has an error, and no value selected)
  const showError = !!error && required && (!value || value === "NotSet");

  return (
    <View style={[styles.container, style]}>
      {label && (
        <BodyText style={styles.label}>
          {label}
          {required && <BodyText style={{ color: colors.error }}> *</BodyText>}
        </BodyText>
      )}

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => onChange(option)}
          >
            <View
              style={[
                styles.checkbox,
                value === option && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                showError && {
                  borderColor: colors.error,
                  borderWidth: 2,
                },
              ]}
            >
              {value === option && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <BodyText style={styles.optionLabel}>{option}</BodyText>
          </TouchableOpacity>
        ))}
      </View>

      {showError && (
        <HelperText type="error" visible={true} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.xs / 2,
    borderRadius: 2,
  },
  optionLabel: {
    fontSize: 14,
  },
  errorText: {
    paddingTop: 0,
    marginTop: 0,
  },
});
