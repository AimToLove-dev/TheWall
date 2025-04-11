"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Surface } from "react-native-paper";
import { TestimonyWall } from "components/testimony";
import { BackButton, BottomSheet, CustomButton } from "components";
import { Ionicons } from "@expo/vector-icons";
import { getAllTestimonies } from "utils/testimoniesUtils";
import { AddSoulInput as AddSoulForm } from "components/souls";
import { useNavigation } from "@react-navigation/native";

export const TestimonyWallScreen = () => {
  const navigation = useNavigation();
  const [testimonies, setTestimonies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => setIsBottomSheetVisible((prev) => !prev);

  const handleSoulAdded = () => {
    toggleBottomSheet();
    // You might want to refresh data after adding a soul
  };

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
    <ImageBackground
      source={require("../assets/paper.jpg")}
      style={[styles.backgroundImage, { height: "100vh" }]}
      resizeMode="repeat"
    >
      <SafeAreaView style={styles.container}>
        <BackButton customOnPress={() => navigation.navigate("Home")} />

        <TestimonyWall testimonies={testimonies} />

        {/* Plus Button */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={toggleBottomSheet}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <CustomButton
              title="Cancel"
              variant="outline"
              onPress={toggleBottomSheet}
              style={{ flex: 1, marginRight: 8 }}
            />
            <CustomButton
              title="Login"
              variant="primary"
              onPress={() => navigation.navigate("Auth")}
              style={{ flex: 1 }}
            />
          </View>
        </BottomSheet>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100vh",
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
