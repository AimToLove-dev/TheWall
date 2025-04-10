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
} from "components";
import { getThemeColors } from "../styles/theme";
import { AuthenticatedUserContext } from "../providers";
import { Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContent } from "../components/MainContent";

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
    navigation.navigate("App", { screen: "Dashboard" });
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
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/paper.jpg")}
        style={[styles.backgroundImage]}
        resizeMode="repeat"
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <ImageBackground
            source={require("../assets/wall.png")}
            style={styles.backgroundImage}
            resizeMode="repeat"
          >
            <View style={{ padding: 20, paddingBottom: 0 }}>
              {/* Masthead */}
              <View style={styles.masthead}>
                <View style={styles.mastheadContainer}>
                  <Image
                    source={require("../assets/TheWall.png")}
                    style={styles.mastheadImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.dateStrip}>
                  <CaptionText>Est. 2025</CaptionText>
                  <CaptionText>{currentDate}</CaptionText>
                  <CaptionText>Price: $2.50</CaptionText>
                </View>
              </View>
            </View>
          </ImageBackground>

          {/* Main Content Component */}
          <MainContent
            navigateToWailingWall={navigateToWailingWall}
            navigateToTestimonyWall={navigateToTestimonyWall}
          />

          {/* Authentication buttons */}
          {user && user?.isAdmin && (
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
          )}

          {/* Footer */}
          <View style={styles.pageFooter}>
            <CaptionText>
              © {new Date().getFullYear()} The Wall. All rights reserved.
            </CaptionText>
            <CaptionText>
              For subscription information, call 1-800-THE-WALL
            </CaptionText>
            <TouchableOpacity>
              <CaptionText style={styles.link}>
                www.thewall.com/subscribe
              </CaptionText>
            </TouchableOpacity>
          </View>

          {/* Page Number */}
          <CaptionText style={styles.pageNumber}>Page 1 of 24</CaptionText>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  // Masthead styles
  masthead: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 1,
    marginBottom: 2,
  },
  mastheadContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  mastheadImage: {
    height: 80,
    width: "100%",
    marginBottom: 10,
  },
  dateStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 5,
    marginTop: 10,
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
    marginTop: "auto",
    marginBottom: 20,
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
});
