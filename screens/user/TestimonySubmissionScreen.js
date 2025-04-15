"use client";

import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "providers";
import {
  CustomButton,
  FormContainer,
  ReadTestimony,
  EditTestimony,
} from "components";
import { HeaderText, SubtitleText, BodyText } from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import {
  submitTestimony,
  canAddMoreTestimonies,
  getUserTestimonies,
  getUserTestimonyById,
  updateTestimony,
} from "utils/testimoniesUtils";
import { createDisplayName } from "@utils/index";

export const TestimonySubmissionScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [loadingTestimonies, setLoadingTestimonies] = useState(true);
  const [errorState, setErrorState] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);

  // States for existing testimonies
  const [userTestimonies, setUserTestimonies] = useState([]);
  const [currentTestimony, setCurrentTestimony] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check if the current user is an admin
  const isAdmin = user?.isAdmin;

  const colors = getThemeColors();

  // Load user testimonies
  useEffect(() => {
    if (user) {
      // Load user's testimonies
      const loadTestimonies = async () => {
        setLoadingTestimonies(true);
        try {
          const testimonies = await getUserTestimonies(user.uid);
          setUserTestimonies(testimonies);

          // Determine the initial state based on existing testimonies
          if (testimonies.length > 0) {
            // Get the most recent testimony
            const latestTestimony = testimonies[0]; // Assuming sorted by date desc
            setCurrentTestimony(latestTestimony);

            // Show testimony in view mode
            setIsEditing(false);
          } else {
            // No testimonies, start with edit mode
            setIsEditing(true);
            setCurrentTestimony(null);
          }

          // Check submission limit
          const canAdd = await canAddMoreTestimonies(user.uid, user.isAdmin);
          setCanSubmit(canAdd);

          if (!canAdd && testimonies.length === 0) {
            Alert.alert(
              "Submission Limit Reached",
              "You have reached the maximum number of testimony submissions. Please contact support for assistance."
            );
          }
        } catch (error) {
          console.error("Error loading testimonies:", error);
          setErrorState("Failed to load testimonies. Please try again.");
        } finally {
          setLoadingTestimonies(false);
        }
      };

      loadTestimonies();
    }
  }, [user]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to handle editing an existing testimony
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to cancel editing and return to view mode
  const handleCancelEdit = () => {
    if (currentTestimony) {
      setIsEditing(false);
    } else {
      // If no testimony exists and user cancels, go back
      navigation.goBack();
    }
  };

  // Function to submit a new testimony or update an existing one
  const handleSubmitTestimony = async (values) => {
    if (!user) {
      setErrorState("You must be logged in to submit a testimony");
      return;
    }

    setLoading(true);
    setErrorState("");
    try {
      // Generate display name using the utility function
      const displayName =
        createDisplayName(values.firstName, values.lastName) ||
        user.displayName ||
        "Anonymous";

      // Prepare testimony data
      let data = {
        // Basic testimony data
        testimony: values.testimony,
        title: values.title || "",
        userId: user.uid,
        userEmail: user.email,
        displayName: displayName,
        submittedByAdmin: isAdmin || false,

        // Profile information
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        city: values.city || "",
        state: values.state || "",
        salvationYear: values.salvationYear || null,
        email: values.email || user.email,
        phoneNumber: values.phoneNumber || "",

        // Faith-related questions
        believeJesusSonOfGod: values.believeJesusSonOfGod || "NotSet",
        believeJesusResurrection: values.believeJesusResurrection || "NotSet",
        repentedFromSins: values.repentedFromSins || "NotSet",
        confessJesusLord: values.confessJesusLord || "NotSet",
        bornAgain: values.bornAgain || "NotSet",
        baptizedHolySpirit: values.baptizedHolySpirit || "NotSet",

        // Sexuality-related questions
        struggleSameSexAttraction: values.struggleSameSexAttraction || "NotSet",
        identifyAsLGBTQ: values.identifyAsLGBTQ || "NotSet",
        vowPurity: values.vowPurity || "NotSet",
        emotionallyDependentSameSex:
          values.emotionallyDependentSameSex || "NotSet",
        healedFromHomosexuality: values.healedFromHomosexuality || "NotSet",
        repentedHomosexuality: values.repentedHomosexuality || "NotSet",

        //Media
        beforeImage: values.beforeImage || null,
        afterImage: values.afterImage || null,
        video: values.video || null,
      };

      if (currentTestimony && currentTestimony.id) {
        // Update existing testimony
        await updateTestimony(currentTestimony.id, {
          ...data,
        });
      } else {
        // Submit new testimony
        await submitTestimony(data);
      }

      // Navigate to success screen
      navigation.navigate("TestimonySubmissionSuccess");
    } catch (error) {
      setErrorState(
        error.message || "Failed to submit testimony. Please try again."
      );
      setLoading(false);
    }
  };

  // Function to start a new testimony
  const handleNewTestimony = () => {
    setCurrentTestimony(null);
    setIsEditing(true);
  };

  const renderContent = () => {
    // Show loading indicator while fetching testimonies
    if (loadingTestimonies) {
      return (
        <View style={styles.loadingContainer}>
          <BodyText>Loading your testimonies...</BodyText>
        </View>
      );
    }

    // Handle different views based on state
    if (isEditing) {
      // Edit mode - show form to create or edit testimony
      return (
        <EditTestimony
          initialTestimony={currentTestimony}
          onSubmit={handleSubmitTestimony}
          onCancel={handleCancelEdit}
          loading={loading}
          errorState={errorState}
          isEdit={!!currentTestimony}
          isAdmin={isAdmin}
        />
      );
    } else if (currentTestimony) {
      // Read mode - show testimony in read-only view
      return (
        <ReadTestimony
          testimony={currentTestimony}
          colors={colors}
          onEdit={handleEdit}
          status={currentTestimony.status}
          isAdmin={isAdmin}
        />
      );
    } else if (userTestimonies.length === 0 && canSubmit) {
      // No testimony yet and can submit - show create form
      return (
        <EditTestimony
          onSubmit={handleSubmitTestimony}
          onCancel={handleCancelEdit}
          loading={loading}
          errorState={errorState}
          isEdit={false}
          isAdmin={isAdmin}
        />
      );
    } else {
      // No testimony and can't submit - show message
      return (
        <View style={styles.emptyStateContainer}>
          <HeaderText>No Testimonies Found</HeaderText>
          <BodyText style={styles.emptyStateText}>
            {canSubmit
              ? "You haven't created any testimonies yet."
              : "You have reached the maximum number of testimonies allowed."}
          </BodyText>
          {canSubmit && (
            <CustomButton
              title="Create Testimony"
              variant="primary"
              onPress={handleNewTestimony}
              style={styles.emptyStateButton}
            />
          )}
        </View>
      );
    }
  };

  return (
    <FormContainer
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.contentContainer]}
    >
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Main content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.inner}>{renderContent()}</View>
      </ScrollView>

      {/* Action buttons for testimony management */}
      {!isEditing && canSubmit && userTestimonies.length > 0 && (
        <View>
          <CustomButton
            title="New Testimony"
            variant="primary"
            onPress={handleNewTestimony}
            icon="add-circle-outline"
            style={styles.floatingButton}
            disabled={!canSubmit}
          />
        </View>
      )}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#F0F0F0",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    textAlign: "center",
    marginVertical: spacing.lg,
  },
  emptyStateButton: {
    marginTop: spacing.lg,
    minWidth: 200,
  },
  floatingButton: {
    paddingHorizontal: spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
