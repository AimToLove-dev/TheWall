"use client";

import { View } from "react-native";
import { Button } from "react-native-paper";
import { getThemeColors } from "styles/theme";

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
  const colors = getThemeColors();

  // Get button colors based on variant
  const getButtonColors = () => {
    switch (variant) {
      case "primary":
        return { backgroundColor: colors.primary };
      case "secondary":
        return { backgroundColor: colors.secondary };
      case "outline":
        return { borderColor: colors.primary };
      case "text":
        return {};
      default:
        return { backgroundColor: colors.primary };
    }
  };

  // Get text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "white";
      case "secondary":
        return "white";
      case "outline":
        return colors.text;
      case "text":
        return colors.text;
      default:
        return "white";
    }
  };

  // Map our custom variants to Paper modes
  const getMode = () => {
    switch (variant) {
      case "primary":
        return "contained";
      case "secondary":
        return "contained-tonal";
      case "outline":
        return "outlined";
      case "text":
        return "text";
      default:
        return "contained";
    }
  };

  // Get button content padding based on size
  const getContentStyle = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 4, paddingHorizontal: 8 };
      case "medium":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 12, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 8, paddingHorizontal: 16 };
    }
  };

  // Create a render function for the left icon to avoid button nesting issues
  const renderLeftIcon = leftIcon ? () => leftIcon : undefined;

  return (
    <Button
      mode={getMode()}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[getButtonColors(), style, { borderRadius: 0 }]}
      contentStyle={[
        getContentStyle(),
        { flexDirection: "row", alignItems: "center" },
      ]}
      labelStyle={[{ color: getTextColor() }, textStyle]}
      textColor={getTextColor()}
      icon={renderLeftIcon}
    >
      {title}
      {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
    </Button>
  );
};
