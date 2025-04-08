"use client";

import { useContext } from "react";
import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { View, HeaderText, BodyText, Logo, CustomButton } from "components";
import { getThemeColors } from "styles/theme";
import { AuthenticatedUserContext } from "providers";
import { Surface } from "react-native-paper";

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

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

  return (
    <Surface
      mode="flat"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Logo section */}
      <View style={styles.logoContainer}>
        <Logo size={150} />
        <HeaderText style={styles.title}>The Wall</HeaderText>
        <BodyText style={styles.subtitle}>
          A place for your prayers and testimonies
        </BodyText>
      </View>

      {/* Main options */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={navigateToWailingWall}
        >
          <HeaderText style={styles.cardTitle}>Wailing Wall</HeaderText>
          <BodyText style={styles.cardText}>
            Share your prayers and intercede for others
          </BodyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={navigateToTestimonyWall}
        >
          <HeaderText style={styles.cardTitle}>Testimony Wall</HeaderText>
          <BodyText style={styles.cardText}>
            Share how God has worked in your life
          </BodyText>
        </TouchableOpacity>
      </View>

      {/* Authentication buttons */}
      <View style={styles.authContainer}>
        {user ? (
          <CustomButton
            title="Go to Dashboard"
            onPress={handleDashboardPress}
            mode="contained"
          />
        ) : (
          <>
            <CustomButton
              title="Login"
              onPress={handleLoginPress}
              mode="outlined"
            />
            <CustomButton
              title="Sign Up"
              onPress={handleSignupPress}
              mode="contained"
            />
          </>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    textAlign: "center",
    marginHorizontal: 20,
  },
  cardsContainer: {
    marginVertical: 20,
  },
  card: {
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    marginBottom: 5,
  },
  cardText: {
    opacity: 0.7,
  },
  authContainer: {
    marginTop: "auto",
    marginBottom: 20,
    gap: 10,
  },
});
