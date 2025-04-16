import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Dimensions,
} from "react-native";
import { HeaderText, BodyText, CustomButton, CaptionText } from "components";
import { Divider } from "react-native-paper";
import { fontSizes } from "../styles/theme";

const screenWidth = Dimensions.get("window").width;

export const MainContent = ({
  navigateToWailingWall,
  navigateToTestimonyWall,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        maxWidth: Math.min(screenWidth, 800),
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
          <HeaderText style={styles.columnTitle}>I AM TRANS!</HeaderText>

          {/* Paragraph */}
          <BodyText style={styles.paragraph}>
            Our mission is to share the transformative power of faith and
            provide a supportive community for those on their journey. Every
            story matters, and your experience can inspire others who are
            seeking their own path to peace and fulfillment.
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
                onPress={navigateToWailingWall}
              >
                <Image
                  source={require("../assets/megaphone.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../assets/flame.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={navigateToTestimonyWall}
              >
                <Image
                  source={require("../assets/bell.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../assets/monet.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                fontSize: "x-small",
                textAlign: "center",
              }}
            >
              LETS BE SOCIAL!
            </Text>
          </View>

          {/* Horizontal rule */}
          <Divider style={styles.divider} />
          {/* Subtitle */}
          <HeaderText style={styles.subtitle}>OUR VISION</HeaderText>

          {/* Paragraph */}
          <BodyText style={styles.paragraph}>
            Connect with us on social media to join our growing community. Share
            your journey, find support, and stay updated on upcoming events and
            resources designed to help you along your path.
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
          <Image
            source={require("../assets/megaphone.png")}
            style={styles.sideIcon}
            resizeMode="contain"
          />
          <Text style={styles.iconSubtitle}>Wailing Wall</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <View style={styles.sideIconContainer}>
          <Image
            source={require("../assets/megaphone.png")}
            style={styles.sideIcon}
            resizeMode="contain"
          />
          <Text style={styles.iconSubtitle}>Give Today</Text>
        </View>
        <View style={styles.verticalDivider} />
        {/* Bell - Right side */}
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={navigateToTestimonyWall}
        >
          <Image
            source={require("../assets/bell.png")}
            style={styles.sideIcon}
            resizeMode="contain"
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
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
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
