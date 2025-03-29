import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * A reusable container for forms that handles keyboard behavior
 * appropriately for both mobile and desktop environments.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the form container
 * @param {Object} props.style - Additional styles for the SafeAreaView
 * @param {Object} props.contentContainerStyle - Additional styles for the ScrollView contentContainerStyle
 * @param {Array} props.edges - SafeAreaView edges array
 * @returns {React.ReactElement} FormContainer component
 */
export const FormContainer = ({
  children,
  style,
  contentContainerStyle,
  edges = ["top", "bottom"],
}) => {
  const { width } = useWindowDimensions();

  // Determine if we're on desktop
  const isDesktop = width > 768;

  // Determine if keyboard dismissal should be enabled (only on mobile)
  const shouldDismissKeyboard = !isDesktop;

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" && !isDesktop ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        {shouldDismissKeyboard ? (
          // On mobile, use TouchableWithoutFeedback to dismiss keyboard
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                contentContainerStyle,
              ]}
            >
              {children}
            </ScrollView>
          </TouchableWithoutFeedback>
        ) : (
          // On desktop, don't use TouchableWithoutFeedback
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              contentContainerStyle,
            ]}
          >
            {children}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
