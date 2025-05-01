"use client";

import React, { useContext } from "react";
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
  Dimensions,
} from "react-native";
import {
  HeaderText,
  BodyText,
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
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Added for social icons

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();

  // Social media URLs
  const socialLinks = {
    facebook: "https://www.facebook.com/AIM2LOVE1",
    tiktok: "https://www.tiktok.com/@aimtolove",
    instagram: "https://www.instagram.com/aim_tolove",
    twitter: "https://twitter.com/aimtolove_?",
  };

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
            <View
              style={{
                padding: 20,
                paddingBottom: 20,
              }}
            >
              {/* Masthead */}
              <View>
                <View style={styles.mastheadContainer}>
                  {/* Three lines with text breaking the center line */}
                  <View style={styles.mastheadLines}>
                    <View style={styles.fullWidthLine}></View>
                    <View style={styles.centerLineWithText}>
                      <View style={styles.halfLine}></View>
                      <Text style={styles.prideToPomiseText}>
                        AIM TO LOVE PRESENTS
                      </Text>
                      <View style={styles.halfLine}></View>
                    </View>
                    <View style={styles.fullWidthLine}></View>
                  </View>

                  {/* Logo section with megaphone and bell on sides */}
                  <View style={styles.logoWithIconsContainer}>
                    {/* 'The Wall' Logo - Center */}
                    <Image
                      source={require("../assets/TheWall.png")}
                      style={styles.mastheadImage}
                      resizeMode="contain"
                    />
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
                    <Text style={styles.theWallLoveText}>
                      FROM PRIDE TO PROMISE
                    </Text>

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
          <View
            style={[
              styles.mainContentContainer,
              { maxWidth: "min(100vw,800px)", alignSelf: "center" },
            ]}
          >
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
          <View
            style={[
              styles.authContainer,
              { maxWidth: "min(100vw,800px)", alignSelf: "center" },
            ]}
          >
            {user ? (
              <CustomButton
                title="Go to Dashboard"
                onPress={handleDashboardPress}
                mode="primary"
                backgroundImage={require("../assets/paper.jpg")} // Darkened for better text visibility
              />
            ) : (
              <>
                <CustomButton
                  title="Login"
                  onPress={handleLoginPress}
                  variant="outline"
                  backgroundImage={require("../assets/paper.jpg")}
                />
                <CustomButton
                  title="Sign Up"
                  onPress={handleSignupPress}
                  variant="primary"
                  backgroundImage={require("../assets/paper.jpg")}
                />
              </>
            )}
          </View>

          {/* Footer */}
          <View
            style={[
              styles.pageFooter,
              { maxWidth: "min(100vw,800px)", alignSelf: "center" },
            ]}
          >
            <CaptionText>
              © {new Date().getFullYear()} The Wall. All rights reserved.
            </CaptionText>
            <TouchableOpacity></TouchableOpacity>
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
          <Image
            source={require("../assets/pillars.png")}
            style={{
              width: 120,
              height: 20,
              marginLeft: 20,
              marginTop: "auto",
              alignSelf: "flex-start",
            }}
            resizeMode="cover"
          />
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
    width: "100%",
    height: 100,
    marginTop: 10,
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
    fontFamily: "XTypewriter-Regular",
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
    fontFamily: "XTypewriter-Regular",
  },
  logoWithIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
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
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 15,
  },
  // Original styles
  authContainer: {
    gap: 10,
    width: "-webkit-fill-available",
    marginHorizontal: 20,
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
    boxShadow: "rgba(6, 24, 44, 0.8) 0px 0px 2px 0px inset",
  },
});
