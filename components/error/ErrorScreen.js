import { StyleSheet, Image, useColorScheme, Platform } from "react-native";
import { View } from "components"; // Import your custom View component
import { HeaderText, BodyText } from "components";
import { CustomButton } from "components";
import { getThemeColors, spacing } from "styles/theme";

const isDevelopment =
  process.env.NODE_ENV === "development" ||
  (Platform.OS === "android" || Platform.OS === "ios" ? __DEV__ : true);

export const ErrorScreen = ({
  title = "Oops! Something went wrong",
  message = "We're having trouble connecting to our servers. Please check your connection and try again.",
  buttonText = "Try Again",
  onRetry,
  error,
  showErrorDetails = isDevelopment,
  imageSource,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  return (
    <View
      isSafe
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.error + "20" },
            ]}
          >
            <HeaderText style={{ color: colors.error, fontSize: 40 }}>
              !
            </HeaderText>
          </View>
        )}

        <HeaderText style={styles.title}>{title}</HeaderText>

        <BodyText style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </BodyText>

        {showErrorDetails && error && (
          <View style={[styles.errorDetails, { backgroundColor: colors.card }]}>
            <BodyText style={{ color: colors.error }}>
              {typeof error === "string"
                ? error
                : error.message || error.toString()}
            </BodyText>
          </View>
        )}

        <CustomButton
          title={buttonText}
          onPress={onRetry}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: 500,
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
  image: {
    width: 200,
    height: 200,
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
  errorDetails: {
    padding: spacing.md,
    borderRadius: 8,
    width: "100%",
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});
