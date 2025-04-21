import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Dimensions,
  Linking,
} from "react-native";
import {
  HeaderText,
  BodyText,
  CustomButton,
  CaptionText,
  WobblingBell,
} from "components";
import { Divider } from "react-native-paper";
import { fontSizes } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export const MainContent = ({
  navigateToWailingWall,
  navigateToTestimonyWall,
}) => {
  // Social media URLs
  const socialLinks = {
    facebook: "https://www.facebook.com/AIM2LOVE1",
    tiktok: "https://www.tiktok.com/@aimtolove",
    youtube: "https://www.youtube.com/channel/UChpxx6QSAjC0jzDsvbvL4RA",
    twitter: "https://twitter.com/aimtolove_?",
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        marginHorizontal: "auto",
        width: "100%",
      }}
    >
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image
          source={require("../assets/header.png")}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      {/* Two Column Layout */}
      <View style={styles.twoColumnContainer}>
        {/* Column 1 - 2/3 width */}
        <View style={styles.leftColumn}>
          {/* 2 images side by side */}
          <View style={styles.imagesContainer}>
            <Image
              source={require("../assets/before.png")}
              style={styles.columnImage}
              resizeMode="cover"
            />
            <Image
              source={require("../assets/after.png")}
              style={styles.columnImage}
              resizeMode="cover"
            />
          </View>

          {/* Title */}
          <HeaderText style={styles.columnTitle}>
            FROM PRIDE TO PROMISE!
          </HeaderText>

          {/* Horizontal rule */}
          <Divider style={styles.divider} />

          {/* Second title */}
          <HeaderText style={styles.columnTitle}>COME TO THE WALL</HeaderText>

          {/* Paragraph */}
          <BodyText style={styles.paragraph}>
            We are calling you to action: to intentionally love, pray for, and
            evangelize the LGBTQ+ community.
          </BodyText>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Column 2 - 1/3 width */}
        <View style={styles.rightColumn}>
          {/* 4 social links in a square (2x2) */}
          <View>
            <View style={styles.socialLinksGrid}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL(socialLinks.facebook)}
              >
                <Ionicons name="logo-facebook" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL(socialLinks.tiktok)}
              >
                <Ionicons name="logo-tiktok" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL(socialLinks.twitter)}
              >
                <Ionicons name="logo-twitter" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL(socialLinks.youtube)}
              >
                <Ionicons name="logo-youtube" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                fontSize: "x-small",
                textAlign: "center",
                fontFamily: "XTypewriter-Regular",
              }}
            >
              LETS BE SOCIAL!
            </Text>
          </View>
          {/* Horizontal rule */}
          <Divider style={styles.divider} />
          {/* Subtitle */}
          <HeaderText style={styles.subtitle}>OUR VISION</HeaderText>

          <BodyText style={styles.paragraph}>
            Monet beltran saw a vision of a Holy Revolution--doors of the Church
            bursting open as the LGBTQ+ flooded in. She believes the Lord has
            comissioned her saying{" "}
            <Text style={{ fontWeight: "bold" }}>
              Prepare a banquet table for the LGBTQ+.
            </Text>
          </BodyText>
        </View>
      </View>

      {/* Logo section with megaphone and bell on sides */}
      <View style={styles.logoWithIconsContainer}>
        {/* Megaphone - Left side */}
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={navigateToWailingWall}
        >
          <WobblingBell
            imageSrc={require("../assets/megaphone.png")}
            style={styles.sideIcon}
            size={40}
            wobbleDelay={3000}
            startingDelay={0}
          />
          <Text style={styles.iconSubtitle}>Wailing Wall</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <View style={styles.sideIconContainer}>
          <WobblingBell
            imageSrc={require("../assets/give.png")}
            style={styles.sideIcon}
            size={40}
            wobbleDelay={3000}
            startingDelay={1000}
          />
          <Text style={styles.iconSubtitle}>Give Today</Text>
        </View>
        <View style={styles.verticalDivider} />
        {/* Bell - Right side */}
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={navigateToTestimonyWall}
        >
          <WobblingBell
            imageSrc={require("../assets/bell.png")}
            style={styles.sideIcon}
            size={40}
            wobbleDelay={3000}
            startingDelay={2000}
          />
          <Text style={styles.iconSubtitle}>Testimony Wall</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  twoColumnContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 20,
    alignItems: "stretch",
  },
  leftColumn: {
    flex: 2,
    paddingRight: 15,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 15,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#000",
    marginHorizontal: 5,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  columnImage: {
    width: "48%",
    height: 120,
  },
  columnTitle: {
    fontWeight: "bold",
    fontSize: fontSizes.medium,
    marginVertical: 10,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: fontSizes.small,
    marginVertical: 10,
    textAlign: "center",
  },
  divider: {
    height: 2,
    backgroundColor: "#000",
    marginVertical: 10,
  },
  paragraph: {
    marginTop: 10,
    textAlign: "justify",
    hyphens: "auto",
  },
  socialLinksContainer: {
    marginVertical: 15,
  },
  socialLinksGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  socialButton: {
    padding: 10,
    width: "40%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: "4%",
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  contentContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
    alignSelf: "stretch",
  },
  textBase: {
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    textTransform: "uppercase",
    marginVertical: 8,
  },
  bloodText: {
    color: "red",
    fontWeight: "bold",
  },
  logoWithIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
  },
  sideIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  sideIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  iconSubtitle: {
    fontSize: fontSizes.xsmall || 12,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "XTypewriter-Regular",
  },
  headerImageContainer: {
    width: "100%",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
});
