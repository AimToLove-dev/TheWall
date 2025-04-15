"use client";

import { TextInput, HelperText } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { getThemeColors } from "styles/theme";

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
  const colors = getThemeColors();

  return (
    <View style={styles.inputContainer}>
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
          backgroundColor: colors.surface,
          marginBottom: 0, // Remove margin bottom since we handle it in container
        }}
        placeholderTextColor={"rgb(73 69 79 / 40%)"}
        {...props}
      />
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    position: "relative",
  },
  errorText: {
    paddingTop: 0,
    marginTop: 0,
  },
});
