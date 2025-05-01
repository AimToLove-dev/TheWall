import React from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * ScrollableScreenView - A reusable component for creating scrollable screens with proper web support
 *
 * This component addresses a common issue in React Native Web/Expo Web where ScrollView doesn't
 * properly handle scrolling content. By wrapping the ScrollView in a View with StyleSheet.absoluteFillObject,
 * we ensure that the ScrollView takes up the full container space and scrolls correctly on web platforms.
 *
 * For reference:
 * 1. On web platforms, ScrollView may not scroll properly without explicit container dimensions
 * 2. absoluteFillObject ensures the ScrollView container fills the parent component
 * 3. This approach is recommended by the React Native community for web-specific ScrollView issues
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered inside the ScrollView
 * @param {Object} props.style - Additional styles for the SafeAreaView container
 * @param {Object} props.contentContainerStyle - Style for the ScrollView's content container
 * @param {Object} props.scrollViewProps - Additional props to pass to the ScrollView component
 * @param {boolean} props.useSafeArea - Whether to use SafeAreaView as the container (default: true)
 * @returns {React.ReactElement} A properly styled scrollable screen view
 */
export const ScrollableScreenView = ({
  children,
  style,
  contentContainerStyle,
  scrollViewProps,
  useSafeArea = true,
}) => {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.container, style]}>
      <View style={StyleSheet.absoluteFillObject}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: Platform.OS === "web" ? "100vh" : "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
