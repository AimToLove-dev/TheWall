import { Text, StyleSheet, useColorScheme } from "react-native"
import { getThemeColors, fontSizes, spacing } from "../styles/theme"

export const HeaderText = ({ children, style, numberOfLines, onPress }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <Text style={[styles.header, { color: colors.text }, style]} numberOfLines={numberOfLines} onPress={onPress}>
      {children}
    </Text>
  )
}

export const SubtitleText = ({ children, style, numberOfLines, onPress }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <Text
      style={[styles.subtitle, { color: colors.textSecondary }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  )
}

export const BodyText = ({ children, style, numberOfLines, onPress }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <Text style={[styles.body, { color: colors.text }, style]} numberOfLines={numberOfLines} onPress={onPress}>
      {children}
    </Text>
  )
}

export const CaptionText = ({ children, style, numberOfLines, onPress }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <Text
      style={[styles.caption, { color: colors.textSecondary }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  )
}

export const LinkText = ({ children, style, numberOfLines, onPress }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <Text style={[styles.link, { color: colors.primary }, style]} numberOfLines={numberOfLines} onPress={onPress}>
      {children}
    </Text>
  )
}

export const ErrorText = ({ children, style, numberOfLines, onPress }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = getThemeColors(isDark)

  return (
    <Text style={[styles.error, { color: colors.error }, style]} numberOfLines={numberOfLines} onPress={onPress}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: fontSizes.xxxl,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
  },
  body: {
    fontSize: fontSizes.md,
  },
  caption: {
    fontSize: fontSizes.sm,
  },
  link: {
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
  error: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
})

