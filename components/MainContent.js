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
import { fontSizes } from "styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export const MainContent = ({
  navigateToWailingWall,
  navigateToTestimonyWall,
}) => {
  const navigation = useNavigation();

  const navigateToBeLove = () => {
    navigation.navigate("BeLove");
  };

  const navigateToInviteUs = () => {
    navigation.navigate("InviteUs");
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        marginHorizontal: "auto",
        width: "100%",
      }}
      accessibilityRole="main"
      accessible={true}
      accessibilityLabel="The Wall - A Holy Revolution for the LGBTQ+ Community"
    >
      {/* Header Image - Main Page Title (H1 equivalent) */}
      <View style={styles.headerImageContainer} accessibilityRole="header">
        <Image
          source={require("../assets/header.png")}
          style={styles.headerImage}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="The Wall - Homepage Header"
        />
        <View style={styles.screenReaderOnly}>
          <Text accessibilityRole="heading" accessibilityLevel={1}>
            The Wall - A Holy Revolution
          </Text>
        </View>
      </View>

      {/* Introduction Section */}
      <View
        style={styles.introductionSection}
        accessibilityRole="region"
        accessible={true}
        accessibilityLabel="Our Mission Walls"
      >
        <View style={styles.screenReaderOnly}>
          <Text accessibilityRole="heading" accessibilityLevel={2}>
            Our Mission Walls
          </Text>
        </View>

        {/* Two wall descriptions */}
        <View style={styles.wallDescriptionsContainer}>
          {/* Wailing Wall description */}
          <View
            style={styles.wallDescriptionColumn}
            accessibilityRole="region"
            accessible={true}
          >
            <View style={styles.wallDescriptionHeader}>
              <TouchableOpacity
                onPress={navigateToWailingWall}
                accessible={true}
                accessibilityLabel="Go to Wailing Wall"
                accessibilityHint="Navigate to the Wailing Wall page"
              >
                <WobblingBell
                  imageSrc={require("../assets/megaphone.png")}
                  style={styles.wallIcon}
                  size={100}
                  wobbleDelay={3000}
                  startingDelay={0}
                />
              </TouchableOpacity>
              <View style={styles.wallTitleContainer}>
                <HeaderText
                  style={styles.wallTitle}
                  accessibilityRole="heading"
                  accessibilityLevel={3}
                >
                  Wailing Wall
                </HeaderText>
              </View>
            </View>
            <BodyText style={styles.wallDescription}>
              A place to submit the names of loved ones in the LGBTQ community
              so we can join in interceding for them in love and hope.{" "}
              <TouchableOpacity
                onPress={navigateToWailingWall}
                accessible={true}
                accessibilityLabel="Visit Wailing Wall"
              >
                <Text style={styles.visitLink}>Visit &gt;</Text>
              </TouchableOpacity>
            </BodyText>
          </View>

          {/* Vertical Divider */}
          <View style={styles.wallDescriptionDivider} />

          {/* Testimony Wall description */}
          <View
            style={styles.wallDescriptionColumn}
            accessibilityRole="region"
            accessible={true}
          >
            <View style={styles.wallDescriptionHeader}>
              <TouchableOpacity
                onPress={navigateToTestimonyWall}
                accessible={true}
                accessibilityLabel="Go to Testimony Wall"
                accessibilityHint="Navigate to the Testimony Wall page"
              >
                <WobblingBell
                  imageSrc={require("../assets/bell.png")}
                  style={styles.wallIcon}
                  size={100}
                  wobbleDelay={3000}
                  startingDelay={1500}
                />
              </TouchableOpacity>
              <View style={styles.wallTitleContainer}>
                <HeaderText
                  style={styles.wallTitle}
                  accessibilityRole="heading"
                  accessibilityLevel={3}
                >
                  Testimony Wall
                </HeaderText>
              </View>
            </View>
            <BodyText style={styles.wallDescription}>
              We believe these testimonies will reflect the transformative love
              of God in a real and tangible way.{" "}
              <TouchableOpacity
                onPress={navigateToTestimonyWall}
                accessible={true}
                accessibilityLabel="Visit Testimony Wall"
              >
                <Text style={styles.visitLink}>Visit &gt;</Text>
              </TouchableOpacity>
            </BodyText>
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Vision and Mission Section */}
      <View
        style={styles.contentContainer}
        accessibilityRole="region"
        accessible={true}
        accessibilityLabel="Our Vision and Mission"
      >
        <View style={styles.screenReaderOnly}>
          <Text accessibilityRole="heading" accessibilityLevel={2}>
            Our Vision and Mission
          </Text>
        </View>

        {/* 2 images side by side */}
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/before.png")}
              style={[styles.columnImage, { scale: "none" }]}
              resizeMode="cover"
              accessible={true}
              accessibilityLabel="Before transformation image"
            />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/after.png")}
              style={[styles.columnImage, { scale: "none" }]}
              resizeMode="cover"
              accessible={true}
              accessibilityLabel="After transformation image"
            />
          </View>
        </View>

        {/* Title - Replaced text with image */}
        <View
          style={styles.p2pImageContainer}
          accessibilityRole="heading"
          accessibilityLevel={3}
        >
          <Image
            source={require("../assets/p2p.png")}
            style={styles.p2pImage}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Pain to Purpose"
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

      {/* Navigation Section */}
      <View style={styles.sectionHeaderContainer} accessibilityRole="header">
        <HeaderText style={styles.sectionHeader}>
          OTHER WAYS TO JOIN:
        </HeaderText>
      </View>
      <View
        style={styles.logoWithIconsContainer}
        accessibilityRole="navigation"
        accessible={true}
        accessibilityLabel="Quick Navigation"
      >
        {/* Megaphone - Left side */}
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={navigateToBeLove}
          accessible={true}
          accessibilityLabel="Go to Be Love"
        >
          <WobblingBell
            imageSrc={require("../assets/flame.png")}
            style={styles.sideIcon}
            size={40}
            wobbleDelay={3000}
            startingDelay={0}
          />
          <HeaderText style={styles.iconTitle}>BE LOVE</HeaderText>
          <Text style={styles.iconSubtitle}>
            Be empowered to love and evangelize the LGBTQ+
          </Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={() =>
            Linking.openURL(
              "https://give.tithe.ly/?formId=587270ba-6865-11ee-90fc-1260ab546d11"
            )
          }
          accessible={true}
          accessibilityLabel="Fund The Movement - Support our mission"
        >
          <WobblingBell
            imageSrc={require("../assets/give.png")}
            style={styles.sideIcon}
            size={40}
            wobbleDelay={3000}
            startingDelay={1000}
          />
          <HeaderText style={styles.iconTitle}>FUND THE MOVEMENT</HeaderText>
          <Text style={styles.iconSubtitle}>
            Invest in Revival-Support Outreach to the LGBTQ+ Community
          </Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        {/* Bell - Right side */}
        <TouchableOpacity
          style={styles.sideIconContainer}
          onPress={navigateToInviteUs}
          accessible={true}
          accessibilityLabel="Go to Invite Us"
        >
          <WobblingBell
            imageSrc={require("../assets/connect.png")}
            style={styles.sideIcon}
            size={40}
            wobbleDelay={3000}
            startingDelay={2000}
          />
          <HeaderText style={styles.iconTitle}>INVITE US</HeaderText>
          <Text style={styles.iconSubtitle}>
            To Preach, Testify, and Release the sound of love and liberation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenReaderOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
  },
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
    width: 2,
    height: "100%",
    backgroundColor: "#000",
    marginHorizontal: 10,
    opacity: 0.7,
  },
  logoWithIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  sideIconContainer: {
    flex: 1,
    alignItems: "center",

    padding: 10,
  },
  sideIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  iconTitle: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "XTypewriter-Regular",
    letterSpacing: -0.5, // Condensed text spacing
  },
  iconSubtitle: {
    fontSize: fontSizes.xsmall || 12,
    fontWeight: "bold",
    textAlign: "justify", // Justified text alignment
    fontFamily: "XTypewriter-Regular",
    hyphens: "auto",
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
  sectionHeaderContainer: {
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
});
