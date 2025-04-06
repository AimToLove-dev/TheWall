"use client";

import { View, Text, StyleSheet, Image } from "react-native";
import { Surface, useTheme } from "react-native-paper";

// Import brick SVGs
const brickImages = [
  require("../assets/bricks/brick1.png"),
  require("../assets/bricks/brick2.png"),
  require("../assets/bricks/brick3.png"),
  require("../assets/bricks/brick4.png"),
  require("../assets/bricks/brick5.png"),
  require("../assets/bricks/brick6.png"),
];

export const WallBrick = ({
  name,
  brickType = 0,
  isFlipped = false,
  style,
}) => {
  const theme = useTheme();

  // Format name to First Name & Last Initial
  const formatName = (fullName) => {
    if (!fullName) return "";

    const parts = fullName.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }

    const firstName =
      parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase() + ".";

    return `${firstName} ${lastInitial}`;
  };

  // Get a random brick type if not specified
  const getBrickType = () => {
    if (
      brickType !== undefined &&
      brickType >= 0 &&
      brickType < brickImages.length
    ) {
      return brickType;
    }
    return Math.floor(Math.random() * brickImages.length);
  };

  const type = getBrickType();
  const formattedName = formatName(name);

  return (
    <Surface mode="flat" style={[styles.brickContainer, style]}>
      <Image
        source={brickImages[type]}
        style={[
          styles.brickImage,
          { transform: isFlipped ? [{ scaleX: -1 }] : undefined },
        ]}
        resizeMode="cover"
      />
      <Text style={styles.nameText}>{formattedName}</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  brickContainer: {
    position: "relative",
    margin: 0,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  brickImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  nameText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // Center-align the text
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.75)",
    zIndex: 1,
    flexWrap: "wrap", // Allow text to wrap to the next line
    width: "100%", // Ensure the text container has a width for wrapping
  },
});
