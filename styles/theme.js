import { Platform } from "react-native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 999,
};

export const shadows = {
  small: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }),
};

// Helper function to get theme colors while maintaining backward compatibility
export const getThemeColors = (isDark) => {
  const theme = isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    primary: theme.colors.primary,
    background: theme.colors.background,
    surface: theme.colors.surface,
    text: theme.colors.onSurface,
    error: theme.colors.error,
    border: theme.colors.outline,
    card: theme.colors.surfaceVariant,
    textSecondary: theme.colors.onSurfaceVariant,
    textTertiary: theme.colors.onSurfaceDisabled,
  };
};
