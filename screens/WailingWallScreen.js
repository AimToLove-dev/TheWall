"use client";

import { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { WailingWall } from "../components/WailingWall";
import { getAllSouls } from "../utils/firebaseUtils";
import { LoadingIndicator } from "../components/LoadingIndicator";

export const WailingWallScreen = () => {
  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSouls();
  }, []);

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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>The Wailing Wall</Text>
      </View>
      <WailingWall souls={souls} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  headerContainer: {
    padding: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  errorText: {
    color: "#FFF",
    textAlign: "center",
    padding: 20,
  },
});
