"use client"

import { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getThemeColors, spacing, borderRadius, fontSizes } from "../styles/theme"

export const CustomInput = ({
  label,
  error,
  touched,
  leftIconName,
  rightIconName,
  onRightIconPress,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  showPasswordToggle = false,
  ...props
}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const actualSecureTextEntry = secureTextEntry && !passwordVisible

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          touched && error && { borderColor: colors.error },
          inputContainerStyle,
        ]}
      >
        {leftIconName && (
          <Ionicons
            name={leftIconName}
            size={20}
            color={isDark ? colors.textSecondary : colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.text }, inputStyle]}
          secureTextEntry={actualSecureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIcon}>
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isDark ? colors.textSecondary : colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIconName && !showPasswordToggle && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon} disabled={!onRightIconPress}>
            <Ionicons name={rightIconName} size={20} color={isDark ? colors.textSecondary : colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {touched && error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    padding: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
  },
  errorText: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
})

