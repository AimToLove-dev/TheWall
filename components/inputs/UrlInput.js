import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { SubtitleText } from "components";
import { spacing } from "styles/theme";

// Simple state constants for better readability
const STATE = Object.freeze({
  LOADING: "loading",
  READ: "read",
  EDIT: "edit",
  ERROR: "error",
  SUCCESS: "success",
  WAIT: "wait",
});

// Generic URL validation function
const validateUrl = (url) => {
  if (!url) {
    return { isValid: false, message: "Please enter a URL" };
  }

  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return {
        isValid: false,
        message: "URL must start with http:// or https://",
      };
    }
    return { isValid: true, message: "URL is valid" };
  } catch (e) {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};

// Component for handling URL input with validation feedback
export const UrlInput = ({
  initialUrl = "",
  onUrlChange,
  colors,
  isLoading: externalLoading = false,
  placeholder = "https://...",
  label = "URL",
  iconName = "link",
}) => {
  // URL and state tracking
  const [currentState, setCurrentState] = useState(
    initialUrl ? STATE.READ : STATE.EDIT
  );
  const [url, setUrl] = useState(initialUrl);
  const [originalUrl, setOriginalUrl] = useState(initialUrl);
  const [urlError, setUrlError] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(null);

  // A valid URL means it's been verified and is working
  const isUrlValid =
    currentState === STATE.SUCCESS ||
    (currentState === STATE.READ && url && originalUrl === url);

  // Update component when external initialUrl changes
  useEffect(() => {
    if (initialUrl !== originalUrl) {
      setUrl(initialUrl);
      setOriginalUrl(initialUrl);
      setCurrentState(initialUrl ? STATE.READ : STATE.EDIT);

      // Validate the initial URL
      if (initialUrl) {
        validateInitialUrl(initialUrl);
      }
    }
  }, [initialUrl]);

  // Clear validation message after delay
  useEffect(() => {
    let timeout;
    if (validationMessage) {
      timeout = setTimeout(() => {
        setValidationMessage("");
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [validationMessage]);

  // Handle success state timeout
  useEffect(() => {
    let timeout;
    if (currentState === STATE.SUCCESS) {
      timeout = setTimeout(() => {
        setCurrentState(STATE.READ);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [currentState]);

  // Validate the initial URL when component first loads or URL changes
  const validateInitialUrl = async (urlToValidate) => {
    try {
      const validationResult = validateUrl(urlToValidate);
      setIsValidUrl(validationResult.isValid);

      // If URL is not valid, show warning but keep in read mode
      if (!validationResult.isValid) {
        setValidationMessage("Stored URL may not be valid");
        setTimeout(() => setValidationMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error validating URL on mount:", err);
      setIsValidUrl(false);
    }
  };

  const handleSave = async () => {
    if (currentState !== STATE.EDIT) return;

    try {
      setCurrentState(STATE.WAIT);

      // Validate URL first
      const validationResult = validateUrl(url);

      if (!validationResult.isValid) {
        setUrlError(validationResult.message);
        setIsValidUrl(false);
        setCurrentState(STATE.ERROR);
        return;
      }

      // If validation passes, notify parent to update configuration
      // But don't set success state yet - that should come from the parent after successful update
      setOriginalUrl(url);
      setIsValidUrl(true);

      // Notify parent component of valid URL change
      if (onUrlChange) {
        // Only change to WAIT state, parent component will need to update initialUrl prop to trigger SUCCESS state
        onUrlChange(url);
        setValidationMessage(
          "URL format is valid. Configuration update in progress..."
        );
      }
    } catch (error) {
      console.error("Error validating URL:", error);
      setUrlError("Error validating URL");
      setIsValidUrl(false);
      setCurrentState(STATE.ERROR);
    }
  };

  const toggleEditMode = () => {
    if (currentState === STATE.EDIT) {
      // If we're exiting edit mode without saving, reset to original
      setUrl(originalUrl);
      setUrlError("");
      setIsValidUrl(null);
      setCurrentState(STATE.READ);
    } else {
      setCurrentState(STATE.EDIT);
    }
  };

  const validateUrlInput = () => {
    if (!url) {
      setUrlError("Please enter a URL");
      setIsValidUrl(false);
      setCurrentState(STATE.ERROR);
      return;
    }

    try {
      const validationResult = validateUrl(url);
      setIsValidUrl(validationResult.isValid);

      if (!validationResult.isValid) {
        setUrlError(validationResult.message);
        setCurrentState(STATE.ERROR);
      } else {
        setUrlError("");
        if (currentState === STATE.EDIT || currentState === STATE.ERROR) {
          setValidationMessage("URL format is valid. Click submit to save.");
          setCurrentState(STATE.EDIT);
        }
      }
    } catch (error) {
      setUrlError("Error validating URL");
      setIsValidUrl(false);
      setCurrentState(STATE.ERROR);
    }
  };

  // Helper functions for UI state rendering
  const isEditMode = () =>
    currentState === STATE.EDIT || currentState === STATE.ERROR;
  const isReadMode = () =>
    currentState === STATE.READ || currentState === STATE.SUCCESS;
  const isLoading = () =>
    currentState === STATE.LOADING ||
    currentState === STATE.WAIT ||
    externalLoading;

  // Handle icon tap based on current state
  const handleIconPress = () => {
    if (!isEditMode()) {
      // Enter edit mode
      toggleEditMode();
    } else {
      // In edit mode, try to save
      handleSave();
    }
  };

  // Get the appropriate icon name based on current state
  const getIconName = () => {
    if (isLoading()) {
      return "reload-circle";
    } else if (isEditMode() === true) {
      return "send";
    } else if (urlError) {
      return "alert-circle";
    } else if (currentState === STATE.SUCCESS) {
      return "checkmark-circle";
    } else {
      return "pencil";
    }
  };

  // Get icon color based on state
  const getIconColor = () => {
    if (isUrlValid && !isEditMode()) {
      return colors.success;
    } else if (urlError) {
      return colors.error;
    } else if (!isEditMode()) {
      return "white";
    } else {
      return colors.primary; // Edit icon color for read mode
    }
  };

  // Get the link icon color (green for valid URLs)
  const getLinkIconColor = () => {
    return isUrlValid ? colors.success : colors.primary;
  };

  // Get text color for the URL (green for valid URLs)
  const getUrlTextColor = () => {
    if (isUrlValid) {
      return colors.success;
    } else if (!isEditMode() && url) {
      return "rgba(0, 0, 0, 0.6)"; // Grey for read-only
    }
    return "rgba(0, 0, 0, 0.87)"; // Default text color
  };

  return (
    <>
      <View style={styles.inputWrapper}>
        <View
          style={[
            styles.inputContainer,
            urlError ? styles.inputError : null,
            {
              backgroundColor: !isEditMode() ? "black" : colors.surface,
              opacity: !isEditMode() ? 0.8 : 1, // Proper readonly visual effect
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={20} color={getLinkIconColor()} />
          </View>

          <TextInput
            placeholder={isEditMode() ? placeholder : ""}
            placeholderTextColor={colors.placeholderText}
            value={url}
            onChangeText={(text) => {
              if (!isEditMode()) return;
              setUrl(text);
              setUrlError("");
              setIsValidUrl(null);
            }}
            onBlur={isEditMode() ? validateUrlInput : null}
            editable={isEditMode() && !isLoading()}
            keyboardType="url"
            autoCapitalize="none"
            style={[styles.textInput, { color: getUrlTextColor() }]}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            mode="flat"
          />

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleIconPress}
            disabled={isLoading()}
          >
            <Ionicons name={getIconName()} size={24} color={getIconColor()} />
          </TouchableOpacity>
        </View>

        {urlError ? (
          <SubtitleText style={styles.errorText}>{urlError}</SubtitleText>
        ) : null}
      </View>

      {validationMessage ? (
        <SubtitleText
          style={[
            styles.validationMessage,
            {
              color: isValidUrl ? colors.success : colors.error,
            },
          ]}
        >
          {validationMessage}
        </SubtitleText>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    height: 50,
  },
  inputError: {
    borderColor: "#B00020",
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  iconButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  validationMessage: {
    marginVertical: spacing.sm,
    textAlign: "center",
  },
});

export default UrlInput;
