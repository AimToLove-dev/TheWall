import { Platform } from "react-native";

export const colors = {
  // Light mode colors
  light: {
    primary: "#5A67F2",
    primaryDark: "#4A56D6",
    background: "#FFFFFF",
    card: "#F7F7F7",
    text: "#333333",
    textSecondary: "#666666",
    textTertiary: "#999999",
    border: "#E1E1E1",
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FFCC00",
  },
  // Dark mode colors
  dark: {
    primary: "#7B83FF",
    primaryDark: "#5A67F2",
    background: "#121212",
    card: "#2A2A2A",
    text: "#FFFFFF",
    textSecondary: "#A0A0A0",
    textTertiary: "#777777",
    border: "#3A3A3A",
    error: "#FF453A",
    success: "#30D158",
    warning: "#FFD60A",
  },
};

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
  colored: (color) =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
};

export const getThemeColors = (isDark) => {
  return isDark ? colors.dark : colors.light;
};
