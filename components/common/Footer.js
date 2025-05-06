import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CaptionText } from "..";
import { Linking } from "react-native";

const Footer = () => {
  // Hardcoded social links as requested
  const socialLinks = {
    facebook: "https://www.facebook.com/AIM2LOVE1",
    tiktok: "https://www.tiktok.com/@aimtolove",
    instagram: "https://www.instagram.com/aim_tolove",
    twitter: "https://twitter.com/aimtolove_?",
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("assets/brickSeamless.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="repeat"
      >
        <View style={styles.pageFooter}>
          <View style={styles.footerContent}>
            {/* About Section */}
            <View style={styles.footerSection}>
              <CaptionText></CaptionText>
            </View>

            {/* Social Media Section */}
            <View style={styles.footerSection}>
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.facebook)}
                >
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.twitter)}
                >
                  <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.tiktok)}
                >
                  <Ionicons name="logo-tiktok" size={24} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.instagram)}
                >
                  <Ionicons name="logo-instagram" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Subscribe Section */}
            <View style={styles.footerSection}>
              <CaptionText></CaptionText>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50, // Section height is 50px
    overflow: "hidden", // This prevents content from overflowing
  },
  backgroundImage: {
    width: "100%",
    height: 200, // Background image is 200px tall
  },
  backgroundImageStyle: {
    height: 200, // Ensure background image is 200px tall
  },
  pageFooter: {
    height: 50, // Keep the footer content at 50px height
    justifyContent: "center", // Center content vertically
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  footerContent: {
    maxWidth: "min(100vw,800px)",
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  footerSection: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 2, // Reduced margin to fit in 50px height
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
});

export default Footer;
