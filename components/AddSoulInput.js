import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { addSoul } from "../utils/firebaseUtils";

export const AddSoulInput = ({
  buttonText = "Add Soul",
  onSuccess,
  onError,
  userId = null, // Optional userId for attribution
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soulName, setSoulName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  // Close keyboard when component unmounts
  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  const toggleInput = () => {
    if (isOpen) {
      // Close the input
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsOpen(false);
        setSoulName("");
        Keyboard.dismiss();
      });
    } else {
      // Open the input
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleSubmit = async () => {
    if (!soulName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const soulData = {
        name: soulName.trim(),
        userId: userId, // This can be null for anonymous submissions
        createdAt: new Date().toISOString(),
        status: "active",
      };

      const soulId = await addSoul(soulData);

      // Reset the input and close
      setSoulName("");
      toggleInput();

      // Notify parent component of success
      if (onSuccess) {
        onSuccess(soulId, soulData);
      }
    } catch (error) {
      console.error("Error adding soul:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the translation for the input container
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Slide up from bottom
  });

  // Handle backdrop press to close the input
  const handleBackdropPress = () => {
    if (isOpen) {
      toggleInput();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {isOpen && (
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {isOpen && (
          <Animated.View
            style={[
              styles.inputContainer,
              {
                transform: [{ translateY }],
                opacity: fadeAnim,
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={soulName}
              onChangeText={setSoulName}
              placeholder="Lost Soul"
              placeholderTextColor="#999"
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              editable={!isSubmitting}
              autoCapitalize="words"
              maxLength={30}
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!soulName.trim() || isSubmitting) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !soulName.trim()}
            >
              <Feather
                name="check"
                size={24}
                color={soulName.trim() && !isSubmitting ? "#fff" : "#999"}
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            isOpen && styles.addButtonActive,
            isSubmitting && styles.addButtonDisabled,
          ]}
          onPress={toggleInput}
          disabled={isSubmitting}
        >
          <Feather name={isOpen ? "x" : "plus"} size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
    zIndex: 100,
  },
  backdrop: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardView: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4a6da7",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 101,
  },
  addButtonActive: {
    backgroundColor: "#e74c3c",
  },
  addButtonDisabled: {
    backgroundColor: "#95a5a6",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 30,
    margin: "auto",
    width: 280,
    height: 50,
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
    marginRight: 20,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#333",
    fontSize: 16,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4a6da7",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
