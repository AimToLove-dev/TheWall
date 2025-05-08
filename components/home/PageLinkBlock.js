import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { BodyText, CustomButton, WobblingBell } from "components";

/**
 * PageLinkBlock component that renders a block with an icon, button and description
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display on the button
 * @param {Function} props.onPress - Function to call when button or icon is pressed
 * @param {Object} props.imageSrc - Image source for the icon
 * @param {string} props.description - Text description that appears below the button
 * @param {Object} props.style - Additional styles for the outer container
 * @param {number} props.wobbleDelay - Delay between wobbles for the icon animation
 * @param {number} props.startingDelay - Initial delay before the first wobble
 * @param {string} props.accessibilityLabel - Accessibility label for the button
 * @param {string} props.accessibilityHint - Accessibility hint for the icon
 * @param {boolean} props.iconInButton - Whether to show the icon inside the button (true) or above it (false)
 */
export const PageLinkBlock = ({
  title,
  onPress,
  imageSrc,
  description,
  style,
  wobbleDelay = 3000,
  startingDelay = 0,
  accessibilityLabel,
  accessibilityHint,
  iconInButton = false,
}) => {
  // Create an icon element to use inside the button if needed
  const iconElement = imageSrc ? (
    <Image
      source={imageSrc}
      style={{
        width: iconInButton ? 24 : 100,
        height: iconInButton ? 24 : 100,
      }}
      resizeMode="contain"
    />
  ) : null;

  return (
    <View
      style={[{ flex: 1 }, style]}
      accessibilityRole="region"
      accessible={true}
    >
      <View style={styles.descriptionHeader}>
        {!iconInButton && (
          <TouchableOpacity
            onPress={onPress}
            accessible={true}
            accessibilityLabel={accessibilityLabel || `Go to ${title}`}
            accessibilityHint={
              accessibilityHint || `Navigate to the ${title} page`
            }
          >
            <WobblingBell
              imageSrc={imageSrc}
              style={styles.icon}
              size={100}
              wobbleDelay={wobbleDelay}
              startingDelay={startingDelay}
            />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <CustomButton
            title={title}
            onPress={onPress}
            mode="primary"
            backgroundImage={require("../../assets/paper.jpg")}
            style={styles.button}
            accessibilityLabel={accessibilityLabel || `Go to ${title}`}
            leftIcon={iconInButton ? iconElement : undefined}
          />
        </View>
      </View>
      <BodyText style={styles.description}>{description}</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionHeader: {
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    width: "100%",
  },
  button: {
    width: "100%",
    marginVertical: 5,
    minHeight: 44, // Ensure minimum height for the button
    justifyContent: "center",
  },
  description: {
    textAlign: "justify",
    fontFamily: "XTypewriter-Bold",
    hyphens: "auto",
    color: "black",
    lineHeight: "1.2em",
  },
});
