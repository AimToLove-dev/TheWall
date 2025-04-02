"use client";

import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { ScreenHeader } from "components/ScreenHeader";
import { WailingWall } from "components/WailingWall";
import { AddSoulInput } from "components";
import { LoadingIndicator } from "components/LoadingIndicator";
import { getAllSouls } from "../utils/firebaseUtils";

export const WailingWallScreen = () => {
  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(1); // Default speed is 1 (normal)

  useEffect(() => {
    fetchSouls();
  }, []);

  const handleSoulAdded = (soulId, soulData) => {
    // Add the new soul to the list without refetching everything
    setSouls((prevSouls) => [...prevSouls, { id: soulId, ...soulData }]);
  };

  const handleSoulError = (error) => {
    console.error("Error adding soul:", error);
    // You could show a toast or alert here
  };

  const fetchSouls = async () => {
    try {
      setLoading(true);
      setError(null);
      const soulsList = await getAllSouls();
      setSouls(soulsList);
    } catch (error) {
      console.error("Error fetching souls:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

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
      <WailingWall souls={souls} speed={50} />
      <ScreenHeader
        onBackPress={() => navigation.navigate("Home")}
        style={styles.header}
      />
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
