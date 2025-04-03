"use client";

import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { LoadingIndicator, TestimonyWall } from "components";
import { AddSoulInput } from "components";
import { getAllTestimonies } from "utils/testimoniesUtils";

export const TestimonyWallScreen = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <LoadingIndicator></LoadingIndicator>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TestimonyWall testimonies={testimonies} />
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
