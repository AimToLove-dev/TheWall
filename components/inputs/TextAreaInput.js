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
  ...props
}) => {
  const colors = getThemeColors();

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        error={!!error}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        mode="outlined"
        style={{ backgroundColor: colors.surface }}
        {...props}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}
    </>
  );
};
