import React from "react";
import { StyleSheet, Image, Text, View, Dimensions } from "react-native";
import { HeaderText, BodyText, WobblingBell } from "components";
import { fontSizes } from "styles/theme";
import { useNavigation } from "@react-navigation/native";
import { PageLinkBlock } from "./PageLinkBlock";

const screenWidth = Dimensions.get("window").width;

export const MainContent = ({
  navigateToWailingWall,
  navigateToTestimonyWall,
}) => {
  const navigation = useNavigation();

  const navigateToResources = () => {
    navigation.navigate("Resources");
  };

  const navigateToInviteUs = () => {
    navigation.navigate("InviteUs");
  };

  return (
    <View
      style={{
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
          source={require("assets/header.png")}
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
          <PageLinkBlock
            title="Wailing Wall"
            onPress={navigateToWailingWall}
            imageSrc={require("assets/megaphone.png")}
            description="Submit names of loved ones in the LGBTQ+ community so we can intercede for them together in love and hope."
            style={{ marginRight: 10 }}
            startingDelay={0}
            accessibilityLabel="Go to Wailing Wall"
            accessibilityHint="Navigate to the Wailing Wall page"
          />

          {/* Testimony Wall description */}
          <PageLinkBlock
            title="Testimony Wall"
            onPress={navigateToTestimonyWall}
            imageSrc={require("assets/bell.png")}
            description="Share testimonies that reveal the real and tangible transformation brought by God’s love."
            style={{ marginLeft: 10 }}
            startingDelay={1500}
            accessibilityLabel="Go to Testimony Wall"
            accessibilityHint="Navigate to the Testimony Wall page"
          />
        </View>
      </View>

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
              source={require("assets/before.png")}
              style={[
                styles.columnImage,
                { filter: "grayscale(100%)", scale: "none" },
              ]}
              resizeMode="cover"
              accessible={true}
              accessibilityLabel="Before transformation image"
            />
            <Text style={styles.imageCaptionText}>MONET BEFORE CHRIST</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require("assets/after.png")}
              style={[styles.columnImage, { scale: "none" }]}
              resizeMode="cover"
              accessible={true}
              accessibilityLabel="After transformation image"
            />
            <Text style={styles.imageCaptionText}>MONET AFTER ADOPTION</Text>
          </View>
        </View>

        {/* Title - Replaced text with image */}
        <View
          style={styles.p2pImageContainer}
          accessibilityRole="heading"
          accessibilityLevel={3}
        >
          <Image
            source={require("assets/p2p.png")}
            style={styles.p2pImage}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Pain to Purpose"
          />
        </View>

        <BodyText style={styles.paragraph}>
          The Wall is a platform dedicated to sharing the transformative power
          of Jesus within the LGBTQ+ community. Through initiatives like the
          Wailing Wall and Testimony Wall, we aim to spark change as we pray
          corporately, share stories of spiritual renewal, and provide resources
          to support churches evangelists, and individuals.
        </BodyText>
        <BodyText style={styles.paragraph}>
          Partner with us in building a movement where everyone is welcomed,
          valued, and supported in discovering the love and truth of Christ.
        </BodyText>
      </View>

      {/* First row: RESOURCE and INVEST */}
      <View
        style={styles.wallDescriptionsContainer}
        accessibilityRole="navigation"
        accessible={true}
        accessibilityLabel="Quick Navigation - Row 1"
      >
        {/* Resources */}
        <PageLinkBlock
          title="RESOURCE"
          onPress={navigateToResources}
          imageSrc={require("assets/flame.png")}
          description="Access materials to help be love, and evangelize the LGBTQ+"
          style={{ marginRight: 10 }}
          startingDelay={0}
          accessibilityLabel="Go to Resources"
          accessibilityHint="Navigate to the Resources page"
          iconInButton={true}
        />

        {/* Invest */}
        <PageLinkBlock
          title="INVEST"
          onPress={() => navigation.navigate("Giving")}
          imageSrc={require("assets/give.png")}
          description="Fund Revival-Support Outreach for the LGBTQ+ Community"
          style={{ marginLeft: 10 }}
          startingDelay={1500}
          accessibilityLabel="Go to Giving"
          accessibilityHint="Navigate to the Giving page"
          iconInButton={true}
        />
      </View>

      {/* Second row: INVITE and VISION */}
      <View
        style={[styles.wallDescriptionsContainer, { marginTop: 40 }]}
        accessibilityRole="navigation"
        accessible={true}
        accessibilityLabel="Quick Navigation - Row 2"
      >
        {/* Invite */}
        <PageLinkBlock
          title="INVITE"
          onPress={navigateToInviteUs}
          imageSrc={require("assets/connect.png")}
          description="Welcome our team to Preach, Testify, and Release the sound of love and liberation"
          style={{ marginRight: 10 }}
          startingDelay={3000}
          accessibilityLabel="Go to Invite Us"
          accessibilityHint="Navigate to the Invite Us page"
          iconInButton={true}
        />

        {/* Vision */}
        <PageLinkBlock
          title="VISION"
          onPress={() => navigation.navigate("Vision")}
          imageSrc={require("assets/eye.png")}
          description="Learn about our Holy Revolution and God's vision for the LGBTQ+ community"
          style={{ marginLeft: 10 }}
          startingDelay={4500}
          accessibilityLabel="Go to Vision"
          accessibilityHint="Navigate to the Vision page"
          iconInButton={true}
        />
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
    alignItems: "center", // Center the caption text
  },
  columnImage: {
    width: "100%",
    height: "100%",
  },
  imageCaptionText: {
    textAlign: "center",
    fontSize: 12,
    color: "white",
    margin: 2,
    marginTop: -36,
    width: "97%",
    padding: 10,
    backgroundColor: "black",
    borderRadius: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    fontFamily: "XTypewriter-Bold",
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
    color: "black",
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

    paddingVertical: 10,
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
    fontFamily: "XTypewriter-Bold",
    hyphens: "auto",
  },
  headerImageContainer: {
    width: "100%",
    marginBottom: 20,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
  introductionSection: {
    marginVertical: 20,
  },
  wallDescriptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "100%",
  },
  wallButton: {
    width: "100%",
    marginVertical: 5,
    minHeight: 44, // Ensure minimum height for the button
    justifyContent: "center",
  },
  wallTitle: {
    fontWeight: "bold",
    fontSize: "1em",
    textAlign: "left",
  },
  wallDescription: {
    fontSize: fontSizes.small,
    textAlign: "justify",
    fontFamily: "XTypewriter-Bold",
    hyphens: "auto",
    color: "black",
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
    width: "100%",
    marginVertical: 0,
  },
  p2pImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 7.5, // Adjust this based on actual image aspect ratio
  },
  sectionHeaderContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButton: {
    width: "100%",
    marginVertical: 5,
    minHeight: 36, // Smaller than the wall buttons
    justifyContent: "center",
  },
});
