"use client";

import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { HelperText } from "react-native-paper";
import { BodyText } from "@components/common/Typography";
import { getThemeColors } from "styles/theme";
import { spacing } from "styles/theme";

export const RadioInput = ({
  label,
  options = [],
  value,
  onChange,
  error,
  required = false,
  style,
  longOptions = false,
  showErrors = false, // New prop to control when to show errors
  ...props
}) => {
  const colors = getThemeColors();

  // Check if we should show an error (only show if required, has an error, and no value selected)
  const showError =
    showErrors && !!error && required && (!value || value === "NotSet");

  const renderOptions = () => {
    return options.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.optionContainer,
          longOptions && styles.longOptionContainer,
        ]}
        onPress={() => onChange(option)}
      >
        <View
          style={[
            styles.radioButton,
            value === option && { borderColor: colors.primary, borderWidth: 2 },
            showError && { borderColor: colors.error, borderWidth: 2 },
          ]}
        >
          {value === option && (
            <View
              style={[
                styles.radioSelected,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </View>
        <BodyText
          style={[
            styles.radioLabel,
            longOptions && styles.longRadioLabel,
            value === option && { fontWeight: "500", color: colors.primary },
          ]}
        >
          {option}
        </BodyText>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <BodyText style={styles.label}>
          {label}
          {required && <BodyText style={{ color: colors.error }}> *</BodyText>}
        </BodyText>
      )}

      {longOptions ? (
        <View>{renderOptions()}</View>
      ) : (
        <View style={styles.optionsContainer}>{renderOptions()}</View>
      )}

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
    paddingVertical: spacing.xs,
  },
  longOptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    marginRight: spacing.sm,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 14,
  },
  longRadioLabel: {
    flex: 1,
    lineHeight: 20,
  },
  errorText: {
    paddingTop: 0,
    marginTop: 0,
  },
});
