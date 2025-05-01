import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { HeaderText, BodyText, CustomButton } from "components";
import { getThemeColors } from "styles/theme";

const theme = getThemeColors();

export const ComingSoon = ({ title, description, imageSrc, onGoBack }) => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`${title} - Coming Soon Page`}
    >
      <View style={styles.content}>
        <Image
          source={imageSrc}
          style={styles.image}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={`${title} icon`}
        />

        <HeaderText
          style={styles.title}
          accessibilityRole="heading"
          accessibilityLevel={1}
        >
          {title}
        </HeaderText>

        <View style={styles.divider} />

        <BodyText style={styles.description}>{description}</BodyText>

        <BodyText style={styles.comingSoonText}>Coming Soon</BodyText>

        <CustomButton
          title="Go Back"
          onPress={onGoBack}
          style={styles.goBackButton}
          accessible={true}
          accessibilityLabel="Go back to previous screen"
          accessibilityHint="Returns to the home page"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background || "#fff",
  },
  content: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "XTypewriter-Bold",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#000",
    marginVertical: 15,
    opacity: 0.3,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary || "#3e477d",
    marginVertical: 20,
    fontFamily: "XTypewriter-Bold",
  },
  goBackButton: {
    marginTop: 20,
  },
});
