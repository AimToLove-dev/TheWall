"use client";

import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { WailingWall, WailingWallReanimated } from "components";
import { AddSoulInput } from "components";
import { getAllSouls, setSouls } from "../utils/soulsUtils";

export const WailingWallScreen = () => {
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(1); // Default speed is 1 (normal)

  const handleSoulAdded = (soulId, soulData) => {
    // Add the new soul to the list without refetching everything
    setSouls((prevSouls) => [...prevSouls, { id: soulId, ...soulData }]);
  };

  const handleSoulError = (error) => {
    console.error("Error adding soul:", error);
    // You could show a toast or alert here
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Error loading the Wailing Wall. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WailingWall />
      <AddSoulInput onSuccess={handleSoulAdded} onError={handleSoulError} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
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
});
