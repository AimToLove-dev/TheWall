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
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
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
        {/* Two wall descriptions */}
        <View style={styles.wallDescriptionsContainer}>
          {/* Wailing Wall description */}
          <View style={styles.wallDescriptionColumn}>
            <View style={styles.wallDescriptionHeader}>
              <TouchableOpacity onPress={navigateToWailingWall}>
                <WobblingBell
                  imageSrc={require("../assets/megaphone.png")}
                  style={styles.wallIcon}
                  size={100}
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
                  size={100}
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

      {/* Content as a single column */}
      <View style={styles.contentContainer}>
        {/* 2 images side by side */}
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/before.png")}
              style={[styles.columnImage, { scale: "none" }]}
              resizeMode="cover"
            />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/after.png")}
              style={[styles.columnImage, { scale: "none" }]}
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

        <BodyText style={styles.paragraph}>
          Monet beltran saw a vision of a Holy Revolution--doors of the Church
          bursting open as the LGBTQ+ flooded in. She believes the Lord has
          comissioned her saying{"\n"}
          <Text style={{ fontWeight: "bold" }}>
            Prepare a banquet table for the LGBTQ+.
          </Text>
        </BodyText>
        <BodyText style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>The wall is that Table</Text>
          {"\n"}A place to love, pray, and evangilize the LGBTQ+ community.
        </BodyText>
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
  contentContainer: {
    width: "100%",
    marginVertical: 20,
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
  sectionTitle: {
    fontWeight: "bold",
    fontSize: fontSizes.medium,
    marginVertical: 10,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
  },
  paragraph: {
    marginTop: 10,
    textAlign: "justify",
    hyphens: "auto",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#000",
    marginHorizontal: 5,
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
    marginBottom: 40,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
  introductionSection: {
    margin: 0,
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
    width: 100,
    height: 100,
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
    opacity: 0.3,
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
