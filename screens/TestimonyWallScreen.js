"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  ImageBackground,
  View,
  Linking,
} from "react-native";
import { ActivityIndicator, Surface } from "react-native-paper";
import { TestimonyWall } from "components/testimony";
import {
  BottomSheet,
  CustomButton,
  ScrollableScreenView,
  WallButtons,
} from "components";
import { getAllTestimonies } from "utils/testimoniesUtils";
import { useNavigation } from "@react-navigation/native";

export const TestimonyWallScreen = () => {
  const navigation = useNavigation();
  const [testimonies, setTestimonies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => setIsBottomSheetVisible((prev) => !prev);

  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const data = await getAllTestimonies();
        setTestimonies(data);
      } catch (err) {
        console.error("Error fetching testimonies:", err);
        setError(err);
      }
      setIsLoading(false);
    };

    fetchTestimonies();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Error loading the Wailing Wall. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <Surface
        mode="flat"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" animating={true} />
      </Surface>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/brickSeamless.png")}
        style={styles.backgroundImage}
        resizeMode="repeat"
      >
        <ScrollableScreenView style={styles.contentContainer}>
          <TestimonyWall testimonies={testimonies} />
        </ScrollableScreenView>
      </ImageBackground>
      {/* Wall Buttons - Both Back and Plus buttons */}
      <WallButtons
        onPlusPress={toggleBottomSheet}
        backNavigateTo="Home"
        fadeAnimation={true}
      />

      {/* Bottom Sheet - rendered outside the ImageBackground for proper layering */}
      <BottomSheet
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        isVisible={isBottomSheetVisible}
        onClose={toggleBottomSheet}
        duration={400}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <CustomButton
            title="Cancel"
            variant="outline"
            onPress={toggleBottomSheet}
            style={{ flex: 1, marginRight: 8 }}
          />
          <CustomButton
            title="Add Testimony"
            variant="primary"
            onPress={() => navigation.navigate("Testimony")}
            style={{ flex: 1 }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    zIndex: 0,
  },
  header: {
    padding: 16,
    position: "absolute", // Position the header at the top of the screen
    top: 0,
    alignItems: "center",
  },
  errorText: {
    color: "#FFF",
    textAlign: "center",
    padding: 20,
  },
  plusButton: {
    position: "fixed",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
});
