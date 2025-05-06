import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BackButton, HeaderText, SubtitleText, Footer } from "components";
import { getThemeColors } from "styles/theme";

export const ComingSoon = ({
  title = "COMING SOON",
  description = "This feature is under development",
  onGoBack = () => {},
  imageSrc,
}) => {
  const colors = getThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button */}
      <BackButton onPress={onGoBack} />

      <View style={styles.content}>
        {/* Optional Image */}
        {imageSrc && (
          <Image source={imageSrc} style={styles.image} resizeMode="contain" />
        )}

        {/* Title and Description */}
        <HeaderText style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </HeaderText>

        <SubtitleText
          style={[styles.description, { color: colors.textSecondary }]}
        >
          {description}
        </SubtitleText>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    maxWidth: 300,
  },
});
