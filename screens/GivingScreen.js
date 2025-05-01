import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DashboardHeader, HeaderText } from "components";
import { getThemeColors } from "styles/theme";

export const GivingScreen = () => {
  const navigation = useNavigation();
  const colors = getThemeColors();
  // The URL for the Tithely donation page
  const tithelyUrl =
    "https://give.tithe.ly/?formId=587270ba-6865-11ee-90fc-1260ab546d11";

  const handleBackPress = () => {
    navigation.goBack();
  };

  // For web platform, use iframe
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <DashboardHeader
            title="Support Our Mission"
            subtitle="Fund Revival for the LGBTQ+ Community"
            onBackPress={handleBackPress}
            colors={colors}
            showSignOut={false}
          />
        </View>

        <iframe
          src={tithelyUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Donation Form"
          allow="payment"
        />
      </View>
    );
  }

  // For native platforms, import WebView dynamically to avoid errors on web
  // This code won't run on web platform
  try {
    const { WebView } = require("react-native-webview");
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <DashboardHeader
          title="Support Our Mission"
          subtitle="Fund Revival for the LGBTQ+ Community"
          onBackPress={handleBackPress}
          colors={colors}
        />
        <WebView
          source={{ uri: tithelyUrl }}
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <DashboardHeader
          title="Support Our Mission"
          subtitle="Fund Revival for the LGBTQ+ Community"
          onBackPress={handleBackPress}
          colors={colors}
        />
        <View style={styles.fallbackMessage}>
          <HeaderText>Please visit {tithelyUrl} to make a donation.</HeaderText>
        </View>
      </View>
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
