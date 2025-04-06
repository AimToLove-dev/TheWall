"use client";

import { TextInput, HelperText, useTheme } from "react-native-paper";

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
  const theme = useTheme();

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
        style={{ backgroundColor: theme.colors.surface }}
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
