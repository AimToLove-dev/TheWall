"use client";

import { TextInput, HelperText } from "react-native-paper";
import { getThemeColors } from "styles/theme";

/**
 * A multi-line text input component with label and error handling
 */
export const TextAreaInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  numberOfLines = 6,
  maxLength,
  style,
  showErrors = false, // New prop to control when to show errors
  ...props
}) => {
  const colors = getThemeColors();

  // Only show errors if showErrors flag is true
  const shouldShowError = showErrors && !!error;

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        error={shouldShowError}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        mode="outlined"
        style={{ backgroundColor: colors.surface }}
        {...props}
      />
      {shouldShowError && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}
    </>
  );
};
