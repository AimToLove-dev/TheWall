"use client";
import { View, TextInput, StyleSheet, useColorScheme } from "react-native";
import { BodyText, ErrorText } from "components";
import { getThemeColors, spacing } from "styles/theme";

/**
 * A multi-line text input component with label and error handling
 */
export const TextAreaInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  placeholder,
  numberOfLines = 6,
  maxLength,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const hasError = error && touched;

  return (
    <View style={[styles.container, style]}>
      {label && <BodyText style={styles.label}>{label}</BodyText>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: hasError ? colors.error : colors.border,
          },
          hasError && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        maxLength={maxLength}
        {...props}
      />
      {maxLength && (
        <BodyText style={[styles.counter, { color: colors.textTertiary }]}>
          {value?.length || 0}/{maxLength}
        </BodyText>
      )}
      {hasError && <ErrorText>{error}</ErrorText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 120,
  },
  inputError: {
    borderWidth: 1.5,
  },
  counter: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
});
