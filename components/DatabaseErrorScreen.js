import { StyleSheet, useColorScheme, Platform, ScrollView } from "react-native";
import { View } from "./View";
import { HeaderText, BodyText, SubtitleText } from "./Typography";
import { CustomButton } from "./CustomButton";
import { getThemeColors, spacing } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const __DEV__ = process.env.NODE_ENV !== "production" || Platform.OS === "web";

export const DatabaseErrorScreen = ({
  onRetry,
  error,
  showErrorDetails = __DEV__,
  navigation,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  // Check if the error is related to Firebase configuration
  const isConfigError =
    error &&
    (error.message?.includes("Firebase") ||
      error.message?.includes("firestore") ||
      error.message?.includes("collection"));

  return (
    <View
      isSafe
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.error + "20" },
            ]}
          >
            <Ionicons name="server-outline" size={40} color={colors.error} />
          </View>

          <HeaderText style={styles.title}>
            Database Connection Error
          </HeaderText>

          <BodyText style={[styles.message, { color: colors.textSecondary }]}>
            We're having trouble connecting to our database. This might be
            because the database hasn't been set up yet or there's a connection
            issue.
          </BodyText>

          {isConfigError && (
            <View
              style={[
                styles.configHelp,
                { backgroundColor: colors.card + "50" },
              ]}
            >
              <SubtitleText style={styles.configTitle}>
                Firebase Configuration Help
              </SubtitleText>
              <BodyText
                style={[styles.configText, { color: colors.textSecondary }]}
              >
                Make sure you have:
              </BodyText>
              <View style={styles.bulletPoints}>
                <BodyText
                  style={[styles.bulletPoint, { color: colors.textSecondary }]}
                >
                  • Set up a Firebase project and enabled Firestore
                </BodyText>
                <BodyText
                  style={[styles.bulletPoint, { color: colors.textSecondary }]}
                >
                  • Added the correct Firebase configuration in your
                  app.config.js or .env file
                </BodyText>
                <BodyText
                  style={[styles.bulletPoint, { color: colors.textSecondary }]}
                >
                  • Created the necessary collections in your Firestore database
                </BodyText>
                <BodyText
                  style={[styles.bulletPoint, { color: colors.textSecondary }]}
                >
                  • Set appropriate security rules for your Firestore database
                </BodyText>
              </View>
            </View>
          )}

          {showErrorDetails && error && (
            <View
              style={[styles.errorDetails, { backgroundColor: colors.card }]}
            >
              <SubtitleText
                style={{ color: colors.error, marginBottom: spacing.sm }}
              >
                Error Details:
              </SubtitleText>
              <BodyText style={{ color: colors.error }}>
                {typeof error === "string"
                  ? error
                  : error.message || error.toString()}
              </BodyText>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Try Again"
              onPress={onRetry}
              variant="primary"
              size="large"
              style={styles.button}
            />

            {navigation && (
              <CustomButton
                title="Go Home"
                onPress={() => navigation.navigate("Home")}
                variant="outline"
                size="large"
                style={styles.secondaryButton}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  configHelp: {
    width: "100%",
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  configTitle: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  configText: {
    marginBottom: spacing.sm,
  },
  bulletPoints: {
    width: "100%",
  },
  bulletPoint: {
    marginBottom: spacing.xs,
  },
  errorDetails: {
    padding: spacing.md,
    borderRadius: 8,
    width: "100%",
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    minWidth: 200,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    minWidth: 200,
  },
});
