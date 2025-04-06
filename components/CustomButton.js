"use client";

import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";

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
  const theme = useTheme();

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

  return (
    <Button
      mode={getMode()}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[getContentStyle(), style]}
      contentStyle={{ flexDirection: "row", alignItems: "center" }}
      labelStyle={textStyle}
      icon={leftIcon ? () => leftIcon : undefined}
    >
      {title}
      {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
    </Button>
  );
};
