import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, useColorScheme } from "react-native"
import { getThemeColors, spacing, borderRadius, fontSizes, shadows } from "../styles/theme"

export const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  // Determine button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          ...shadows.colored(colors.primary),
        }
      case "secondary":
        return {
          backgroundColor: isDark ? "rgba(90, 103, 242, 0.15)" : "rgba(90, 103, 242, 0.1)",
          borderColor: "transparent",
        }
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.border,
          borderWidth: 1,
        }
      case "text":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
        }
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          ...shadows.colored(colors.primary),
        }
    }
  }

  // Determine text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#FFFFFF"
      case "secondary":
      case "outline":
      case "text":
        return colors.primary
      default:
        return "#FFFFFF"
    }
  }

  // Determine button height based on size
  const getButtonHeight = () => {
    switch (size) {
      case "small":
        return 40
      case "medium":
        return 48
      case "large":
        return 56
      default:
        return 48
    }
  }

  // Determine text size based on button size
  const getTextSize = () => {
    switch (size) {
      case "small":
        return fontSizes.sm
      case "medium":
        return fontSizes.md
      case "large":
        return fontSizes.md
      default:
        return fontSizes.md
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        { height: getButtonHeight() },
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : colors.primary} size="small" />
      ) : (
        <>
          {leftIcon && <span style={styles.leftIcon}>{leftIcon}</span>}
          <Text
            style={[
              styles.buttonText,
              {
                color: getTextColor(),
                fontSize: getTextSize(),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <span style={styles.rightIcon}>{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
})

