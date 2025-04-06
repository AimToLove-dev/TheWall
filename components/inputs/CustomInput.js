"use client";

import { TextInput, HelperText, useTheme } from "react-native-paper";

export const CustomInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  leftIcon,
  rightIcon,
  disabled,
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
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        left={leftIcon && <TextInput.Icon icon={leftIcon} />}
        right={rightIcon && <TextInput.Icon icon={rightIcon} />}
        disabled={disabled}
        mode="outlined"
        style={{
          backgroundColor: theme.colors.surface,
          marginBottom: error ? 0 : 16,
        }}
        {...props}
      />
      {error && (
        <HelperText type="error" visible={!!error} style={{ marginBottom: 16 }}>
          {error}
        </HelperText>
      )}
    </>
  );
};
