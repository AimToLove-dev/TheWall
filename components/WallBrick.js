import { View, Text, StyleSheet, Image } from "react-native";

// Import brick SVGs
const brickImages = [
  require("../assets/brick1.png"),
  require("../assets/brick2.png"),
  require("../assets/brick3.png"),
  require("../assets/brick4.png"),
  require("../assets/brick5.png"),
  require("../assets/brick6.png"),
];

export const WallBrick = ({ name, brickType = 0, style }) => {
  // Format name to First Name & Last Initial
  const formatName = (fullName) => {
    if (!fullName) return "";

    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];

    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1][0] + ".";

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
    <View style={[styles.brickContainer, style]}>
      <Image
        source={brickImages[type]}
        style={styles.brickImage}
        resizeMode="cover"
      />
      <Text style={styles.nameText}>{formattedName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  brickContainer: {
    position: "relative",
    margin: 0,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 1,
  },
});
