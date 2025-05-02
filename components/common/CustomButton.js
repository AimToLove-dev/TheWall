"use client";

import { View, ImageBackground, StyleSheet } from "react-native";
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
  backgroundImage,
  imageStyle,
  mode,
}) => {
  const colors = getThemeColors();

  // Get button colors based on variant
  const getButtonColors = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: backgroundImage ? "transparent" : colors.primary,
        };
      case "secondary":
        return {
          backgroundColor: backgroundImage ? "transparent" : colors.secondary,
        };
      case "outline":
        return {
          backgroundColor: backgroundImage ? "transparent" : undefined,
        };
      case "text":
        return {};
      default:
        return {
          backgroundColor: backgroundImage ? "transparent" : colors.primary,
        };
    }
  };

  // Get text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return backgroundImage ? "black" : "white";
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
    const modeFromProps = mode || variant;
    switch (modeFromProps) {
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
        return { paddingVertical: 4, paddingHorizontal: 8, margin: 0 };
      case "medium":
        return { paddingVertical: 8, paddingHorizontal: 8, margin: 0 };
      case "large":
        return { paddingVertical: 12, paddingHorizontal: 8, margin: 0 };
      default:
        return { paddingVertical: 8, paddingHorizontal: 8, margin: 0 };
    }
  };

  // Enhanced render function for left icon to provide better spacing and aesthetic
  const renderLeftIcon = leftIcon
    ? () => <View style={styles.leftIconContainer}>{leftIcon}</View>
    : undefined;

  // If we have a background image, wrap the button in an ImageBackground
  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[
          {
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "rgba(6, 24, 44, 0.8) 0px 0 6px -1px",
            filter: getMode() == "contained" ? "invert(1)" : "",
          },
          style,
        ]}
        imageStyle={imageStyle}
        resizeMode="cover"
      >
        <Button
          mode={getMode()}
          onPress={onPress}
          loading={loading}
          disabled={disabled}
          style={[getButtonColors(), { borderRadius: 0 }]}
          contentStyle={[
            getContentStyle(),
            {
              flexDirection: "row",
              alignItems: "center",
              boxShadow: "rgba(6, 24, 44, 0.8) 0px 0px 2px 0px inset",
              flexWrap: "wrap",
            },
          ]}
          labelStyle={[
            {
              color: getTextColor(),
              flexWrap: "wrap",
              textAlign: "center",
              whiteSpace: "normal",
              marginLeft: leftIcon ? 8 : 0, // Add margin when there's a left icon
            },
            textStyle,
          ]}
          textColor={getTextColor()}
          icon={renderLeftIcon}
        >
          {title}
          {rightIcon && (
            <View style={styles.rightIconContainer}>{rightIcon}</View>
          )}
        </Button>
      </ImageBackground>
    );
  }

  // Standard button without background image
  return (
    <Button
      mode={getMode()}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[getButtonColors(), style, { borderRadius: 0 }]}
      contentStyle={[
        getContentStyle(),
        {
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
        },
      ]}
      labelStyle={[
        {
          color: getTextColor(),
          flexWrap: "wrap",
          textAlign: "center",
          whiteSpace: "normal",
          marginLeft: leftIcon ? 8 : 0, // Add margin when there's a left icon
        },
        textStyle,
      ]}
      textColor={getTextColor()}
      icon={renderLeftIcon}
    >
      {title}
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </Button>
  );
};

const styles = StyleSheet.create({
  leftIconContainer: {
    marginRight: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconContainer: {
    marginLeft: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
