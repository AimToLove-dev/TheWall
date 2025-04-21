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

      {/* Introduction Section */}
      <View style={styles.introductionSection}>
        <BodyText style={styles.introText}>
          The Wall is a virtual expression of a prophetic timeline inspired by
          words from Bob Jones, Lou Engle Ministries, and Monet Beltran (founder
          of AIM TO LOVE). Simply put, it's a website featuring two powerful
          spaces:
        </BodyText>

        {/* Two wall descriptions */}
        <View style={styles.wallDescriptionsContainer}>
          {/* Wailing Wall description */}
          <View style={styles.wallDescriptionColumn}>
            <View style={styles.wallDescriptionHeader}>
              <TouchableOpacity onPress={navigateToWailingWall}>
                <WobblingBell
                  imageSrc={require("../assets/megaphone.png")}
                  style={styles.wallIcon}
                  size={40}
                  wobbleDelay={3000}
                  startingDelay={0}
                />
              </TouchableOpacity>
              <View style={styles.wallTitleContainer}>
                <HeaderText style={styles.wallTitle}>Wailing Wall</HeaderText>
              </View>
            </View>
            <BodyText style={styles.wallDescription}>
              A place to submit the names of loved ones in the LGBTQ community
              so we can join in interceding for them in love and hope.{" "}
              <TouchableOpacity onPress={navigateToWailingWall}>
                <Text style={styles.visitLink}>Visit &gt;</Text>
              </TouchableOpacity>
            </BodyText>
          </View>

          {/* Vertical Divider */}
          <View style={styles.wallDescriptionDivider} />

          {/* Testimony Wall description */}
          <View style={styles.wallDescriptionColumn}>
            <View style={styles.wallDescriptionHeader}>
              <TouchableOpacity onPress={navigateToTestimonyWall}>
                <WobblingBell
                  imageSrc={require("../assets/bell.png")}
                  style={styles.wallIcon}
                  size={40}
                  wobbleDelay={3000}
                  startingDelay={1500}
                />
              </TouchableOpacity>
              <View style={styles.wallTitleContainer}>
                <HeaderText style={styles.wallTitle}>Testimony Wall</HeaderText>
              </View>
            </View>
            <BodyText style={styles.wallDescription}>
              We believe these testimonies will reflect the transformative love
              of God in a real and tangible way.{" "}
              <TouchableOpacity onPress={navigateToTestimonyWall}>
                <Text style={styles.visitLink}>Visit &gt;</Text>
              </TouchableOpacity>
            </BodyText>
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Two Column Layout */}
      <View style={styles.twoColumnContainer}>
        {/* Column 1 - 2/3 width */}
        <View style={styles.leftColumn}>
          {/* 2 images side by side */}
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/before.png")}
                style={styles.columnImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/after.png")}
                style={styles.columnImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Title - Replaced text with image */}
          <View style={styles.p2pImageContainer}>
            <Image
              source={require("../assets/p2p.png")}
              style={styles.p2pImage}
              resizeMode="contain"
            />
          </View>

          {/* Horizontal rule */}
          <Divider style={styles.divider} />

          {/* Second title */}
          <HeaderText style={styles.columnTitle}>COME TO THE WALL</HeaderText>

          {/* Paragraph */}
          <BodyText style={styles.paragraph}>
            Monet beltran saw a vision of a Holy Revolution--doors of the Church
            bursting open as the LGBTQ+ flooded in. She believes the Lord has
            comissioned her saying{" "}
            <Text style={{ fontWeight: "bold" }}>
              Prepare a banquet table for the LGBTQ+.
            </Text>
          </BodyText>
          <Divider style={styles.divider} />
          <BodyText style={styles.paragraph}>
            We are called to the Wall! A united voice proclaiming Jesus and the
            power of transformation. Calling the LGBTQ+ and the Church into a
            journey of healing, liberty, and holiness.
          </BodyText>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Column 2 - 1/3 width */}
        <View style={styles.rightColumn}>
          {/* Subtitle */}
          <HeaderText style={styles.subtitle}>VISION STATEMENT</HeaderText>

          <BodyText style={styles.paragraph}>
            To ignite a Holy Revolution where love and truth converge, bringing
            awakening, healing, and freedom to hearts in the LGBTQ+ community
            through the life changing power of the blood of Jesus.
          </BodyText>

          {/* Horizontal rule */}
          <Divider style={styles.divider} />

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
          />
          <Text style={styles.iconSubtitle}>Wailing Wall</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={() =>
            Linking.openURL(
              "https://give.tithe.ly/?formId=587270ba-6865-11ee-90fc-1260ab546d11"
            )
          }
        >
          <Image
            source={require("../assets/give.png")}
            style={styles.sideIcon}
          />
          <Text style={styles.iconSubtitle}>Give Today</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        {/* Bell - Right side */}
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={navigateToTestimonyWall}
        >
          <Image
            source={require("../assets/bell.png")}
            style={styles.sideIcon}
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
    width: "100%",
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1, // This ensures a square shape
    marginHorizontal: 5,
    overflow: "hidden", // This ensures the image doesn't overflow the wrapper
  },
  columnImage: {
    width: "100%",
    height: "100%",
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
    height: 1,
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
    marginTop: 10,
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
  introductionSection: {
    margin: 0,
  },
  introTitle: {
    fontWeight: "bold",
    fontSize: fontSizes.large,
    textAlign: "center",
    marginBottom: 10,
  },
  introText: {
    fontSize: fontSizes.medium,
    textAlign: "justify",
    marginBottom: 20,
  },
  wallDescriptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wallDescriptionColumn: {
    flex: 1,
  },
  wallDescriptionHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  wallIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  wallTitleContainer: {
    flex: 1,
  },
  wallTitle: {
    fontWeight: "bold",
    fontSize: "1em",
    textAlign: "left",
  },
  wallDescription: {
    fontSize: fontSizes.small,
    textAlign: "justify",
  },
  wallDescriptionDivider: {
    width: 1,
    backgroundColor: "#000",
    marginHorizontal: 10,
    opacity: 0.5,
    height: "75%",
    marginTop: "auto",
  },
  visitLink: {
    fontWeight: "bold",
    color: "#3e477d",
    textDecorationLine: "underline",
  },
  p2pImageContainer: {
    alignItems: "center",
    marginVertical: 0,
  },
  p2pImage: {
    width: "100%",
    height: 32,
  },
});
