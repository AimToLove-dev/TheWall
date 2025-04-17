"use client";

import { useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  HeaderText,
  BodyText,
  Logo,
  CustomButton,
  SubtitleText,
  CaptionText,
  FormContainer,
  WobblingBell,
} from "components";
import { getThemeColors } from "../styles/theme";
import { AuthenticatedUserContext } from "providers";
import { Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContent, ScrollableScreenView } from "components";
import { Link } from "@react-navigation/native";

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();

  const handleLoginPress = () => {
    navigation.navigate("Auth", { screen: "Login" });
  };

  const handleSignupPress = () => {
    navigation.navigate("Auth", { screen: "Signup" });
  };

  const handleDashboardPress = () => {
    navigation.navigate("User");
  };

  const navigateToWailingWall = () => {
    navigation.navigate("WailingWall");
  };

  const navigateToTestimonyWall = () => {
    navigation.navigate("TestimonyWall");
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/brickSeamless.png")}
        style={styles.backgroundImage}
        resizeMode="repeat"
      >
        <ScrollableScreenView>
          {/* Brick Header Background */}
          <ImageBackground
            source={require("../assets/brick.png")}
            style={styles.wallBackground}
            imageStyle={{ backgroundRepeat: "repeat-x" }}
            resizeMode="contain"
          >
            <View style={{ padding: 20, paddingBottom: 0 }}>
              {/* Masthead */}
              <View>
                <View style={styles.mastheadContainer}>
                  {/* Three lines with text breaking the center line */}
                  <View style={styles.mastheadLines}>
                    <View style={styles.fullWidthLine}></View>
                    <View style={styles.centerLineWithText}>
                      <View style={styles.halfLine}></View>
                      <Text style={styles.prideToPomiseText}>
                        From Pride to Promise
                      </Text>
                      <View style={styles.halfLine}></View>
                    </View>
                    <View style={styles.fullWidthLine}></View>
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

                    {/* 'The Wall' Logo - Center */}
                    <Image
                      source={require("../assets/TheWall.png")}
                      style={styles.mastheadImage}
                      resizeMode="contain"
                    />

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
                        startingDelay={1500}
                      />
                      <Text style={styles.iconSubtitle}>Testimony Wall</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* New flame strip replacing date strip */}
                <View style={styles.flameStrip}>
                  <View style={styles.fullWidthLine}></View>
                  <View style={styles.flameContainer}>
                    {/* Left side flames */}
                    <Image
                      source={require("../assets/flame.png")}
                      style={styles.flameIcon}
                      resizeMode="contain"
                    />
                    <Image
                      source={require("../assets/flame.png")}
                      style={styles.flameIcon}
                      resizeMode="contain"
                    />
                    <Image
                      source={require("../assets/flame.png")}
                      style={styles.flameIcon}
                      resizeMode="contain"
                    />

                    {/* Center text */}
                    <Text style={styles.theWallLoveText}>THEWALL.LOVE</Text>

                    {/* Right side flames */}
                    <Image
                      source={require("../assets/flame.png")}
                      style={styles.flameIcon}
                      resizeMode="contain"
                    />
                    <Image
                      source={require("../assets/flame.png")}
                      style={styles.flameIcon}
                      resizeMode="contain"
                    />
                    <Image
                      source={require("../assets/flame.png")}
                      style={styles.flameIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.fullWidthLine}></View>
                </View>
              </View>
            </View>
          </ImageBackground>

          {/* Main Content Component */}
          <View style={styles.mainContentContainer}>
            <ImageBackground
              source={require("../assets/paper.jpg")}
              style={styles.paperBackground}
              resizeMode="repeat"
            >
              <View style={styles.paperContentWrapper}>
                <MainContent
                  navigateToWailingWall={navigateToWailingWall}
                  navigateToTestimonyWall={navigateToTestimonyWall}
                />
              </View>
            </ImageBackground>
          </View>

          {/* Authentication buttons */}

          <View style={styles.authContainer}>
            {user ? (
              <CustomButton
                title="Go to Dashboard"
                onPress={handleDashboardPress}
                mode="primary"
              />
            ) : (
              <>
                <CustomButton
                  title="Login"
                  onPress={handleLoginPress}
                  variant="outline"
                />
                <CustomButton
                  title="Sign Up"
                  onPress={handleSignupPress}
                  variant="primary"
                />
              </>
            )}
          </View>

          {/* Footer */}
          <View style={styles.pageFooter}>
            <CaptionText>
              © {new Date().getFullYear()} The Wall. All rights reserved.
            </CaptionText>
            <TouchableOpacity></TouchableOpacity>
          </View>

          {/* Page Number */}
          <CaptionText style={styles.pageNumber}>Page 1 of 24</CaptionText>
        </ScrollableScreenView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Masthead styles
  mastheadContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  mastheadImage: {
    height: 80,
    flexGrow: 1,
    flex: 0.6, // Give more space to the center logo
    minWidth: 0,
    maxWidth: 300,
    marginHorizontal: 10, // Reduced from 20 to give more space on small screens
  },
  mastheadLines: {
    width: "100%",
    marginBottom: 10,
  },
  fullWidthLine: {
    height: 2,
    backgroundColor: "#000",
    width: "100%",
    marginVertical: 5,
  },
  centerLineWithText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  halfLine: {
    height: 2,
    backgroundColor: "#000",
    flex: 1,
  },
  prideToPomiseText: {
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  flameStrip: {
    marginTop: 10,
    alignItems: "center",
  },
  flameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  flameIcon: {
    height: 12,
    width: 12,
  },
  theWallLoveText: {
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  logoWithIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  sideIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.2, // Changed from fixed width to flex
    minWidth: 40, // Add minimum width
    maxWidth: 80, // Add maximum width
  },
  sideIcon: {
    height: 40,
    width: 40,
    marginBottom: 5,
    // Make the icon responsive
    maxWidth: "100%",
    maxHeight: "100%",
    aspectRatio: 1,
  },
  iconSubtitle: {
    fontSize: 12,
    textAlign: "center",
    maxWidth: "100%",
    overflowWrap: "normal",
  },
  // Page footer styles
  pageFooter: {
    marginTop: 20,
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginHorizontal: 20,
  },
  link: {
    textDecorationLine: "underline",
    color: "#0066cc",
  },
  pageNumber: {
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
    marginBottom: 20,
  },
  // Original styles
  authContainer: {
    gap: 10,
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  wallBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundRepeat: "repeat-x",
  },
  mainContentContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: "hidden",
    boxShadow: "rgba(6, 24, 44, 0.8) 0px 0 6px -1px",
  },
  paperBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  paperContentWrapper: {
    padding: 20,
  },
});
