"use client";

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from "react-native";
import { Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "./View";

export const FormContainer = ({
  children,
  style,
  contentContainerStyle,
  dismissKeyboard = false,
}) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Surface mode="flat" style={[{ flex: 1 }, style]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          >
            {dismissKeyboard ? (
              <TouchableWithoutFeedback>
                <View style={{ flex: 1 }}>{children}</View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={{ flex: 1 }}>{children}</View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Surface>
    </SafeAreaView>
  );
};
