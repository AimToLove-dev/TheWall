import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { ComingSoon } from "../components/ComingSoon";
import { useNavigation } from "@react-navigation/native";
import { DashboardHeader, HeaderText } from "components";
import { getThemeColors } from "styles/theme";

export const InviteUsScreen = () => {
  const navigation = useNavigation();
  const colors = getThemeColors();

  // Google Form URL
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfIDkmTGIpI_Px-lElTbcI_8zHVeP_VedWJbQRHMFnjtf4jhw/viewform?usp=dialog";

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  // For web platform, use iframe
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <DashboardHeader
            title="INVITE US"
            subtitle="Request our speakers and leaders for your event"
            onBackPress={handleBackPress}
            colors={colors}
            showSignOut={false}
          />
        </View>

        <iframe
          src={googleFormUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Invitation Request Form"
        />
      </View>
    );
  }

  // For native platforms, import WebView dynamically to avoid errors on web
  try {
    const { WebView } = require("react-native-webview");
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <DashboardHeader
          title="INVITE US"
          subtitle="Request our speakers and leaders for your event"
          onBackPress={handleBackPress}
          colors={colors}
        />
        <WebView
          source={{ uri: googleFormUrl }}
          style={styles.webview}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    );
  } catch (error) {
    // Fallback for platforms where WebView is not supported
    return (
      <ComingSoon
        title="INVITE US"
        description="A sound of love and liberation. Learn how to invite our speakers and leaders to your church or organization to share testimonies and bring hope to your community."
        imageSrc={require("assets/connect.png")}
        onGoBack={() => navigation.navigate("Home")}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  webview: {
    flex: 1,
  },
  fallbackMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
