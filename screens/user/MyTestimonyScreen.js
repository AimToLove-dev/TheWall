"use client";

import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "providers";
import {
  CustomButton,
  FormContainer,
  ProfileIncomplete,
  ConnectTestimony,
  ConfirmationPage,
  ReadTestimony,
  EditTestimony,
} from "components";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
} from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import {
  submitTestimony,
  canAddMoreTestimonies,
  getUserTestimonies,
  getUserTestimonyById,
  linkTestimonyToSoulRecord,
  updateTestimony,
} from "utils/testimoniesUtils";
import { checkProfileCompleteness, getFullName } from "@utils/profileUtils";
import { findMatchingSouls, addSoul } from "utils/soulsUtils";

export const MyTestimonyScreen = ({ navigation }) => {
  const { user, profile } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [loadingTestimonies, setLoadingTestimonies] = useState(true);
  const [errorState, setErrorState] = useState("");
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [missingFields, setMissingFields] = useState([]);

  // States for existing testimonies
  const [userTestimonies, setUserTestimonies] = useState([]);
  const [currentTestimony, setCurrentTestimony] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // States for the step process
  const [currentStep, setCurrentStep] = useState(1);
  // 1: Form/Read/Edit, 2: Connect, 3: Confirmation
  const [testimonyData, setTestimonyData] = useState(null);
  const [matchingSouls, setMatchingSouls] = useState([]);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  // Load user testimonies and check profile completeness
  useEffect(() => {
    if (user) {
      // Check profile completeness
      const { isComplete, missingFields } = checkProfileCompleteness(profile);
      setProfileComplete(isComplete);
      setMissingFields(missingFields);

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

            // Set the proper step based on testimony status
            if (latestTestimony.status === "unlinked") {
              prepareConnectStep(latestTestimony);
            } else {
              setCurrentStep(1); // View/Edit step
              setIsEditing(false);
            }
          } else {
            // No testimonies, start at form step
            setCurrentStep(1);
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

  const handleCompleteProfile = () => {
    navigation.navigate("Profile", { startEditing: true });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const navigateToDashboard = () => {
    navigation.navigate("Dashboard");
  };

  // Function to handle editing an existing testimony
  const handleEdit = () => {
    setIsEditing(true);

    // Set initial form values from current testimony
    if (currentTestimony) {
      setBeforeImage(currentTestimony.beforeImage || null);
      setAfterImage(currentTestimony.afterImage || null);
      setVideo(currentTestimony.video || null);
    }
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

  // Function to prepare for the connect step (finding matching souls)
  const prepareConnectStep = async (testimony) => {
    setLoading(true);
    setErrorState("");

    try {
      // Store the testimony data
      setTestimonyData(testimony);

      // Find matching souls based on the user's name
      const fullName = getFullName(profile);
      const matches = await findMatchingSouls(fullName);
      setMatchingSouls(matches);

      // Move to the connect step
      setCurrentStep(2);
    } catch (error) {
      console.error("Error preparing to connect testimony:", error);
      setErrorState("Failed to load soul matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to submit a new testimony or update an existing one
  const handleSubmitTestimony = async (values) => {
    if (!user) {
      setErrorState("You must be logged in to submit a testimony");
      return;
    }

    if (!profileComplete) {
      setErrorState(
        "Please complete your profile before submitting a testimony"
      );
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      // Prepare testimony data
      const data = {
        testimony: values.testimony,
        userId: profile.uid || user.uid,
        userEmail: profile.email,
        displayName: getFullName(profile),
        phoneNumber: profile?.phoneNumber,
        address: profile?.address,
        dob: profile?.dob,
      };

      if (currentTestimony && currentTestimony.id) {
        // Update existing testimony
        await updateTestimony(currentTestimony.id, {
          ...data,
          // Only update media if it has changed
          ...(beforeImage !== currentTestimony.beforeImage && { beforeImage }),
          ...(afterImage !== currentTestimony.afterImage && { afterImage }),
          ...(video !== currentTestimony.video && { video }),
          // If previously approved or pending, set back to pending
          status: ["approved", "pending"].includes(currentTestimony.status)
            ? "pending"
            : currentTestimony.status,
        });

        // Get the updated testimony
        const updatedTestimony = await getUserTestimonyById(
          user.uid,
          currentTestimony.id
        );

        if (updatedTestimony) {
          // Refresh testimonies list and set current testimony
          const updatedTestimonies = await getUserTestimonies(user.uid);
          setUserTestimonies(updatedTestimonies);
          setCurrentTestimony(updatedTestimony);

          // Exit edit mode
          setIsEditing(false);
        } else {
          setErrorState("Failed to retrieve the updated testimony.");
        }
      } else {
        // Submit new testimony (status will be 'unlinked' initially)
        const newTestimonyId = await submitTestimony(
          data,
          beforeImage,
          afterImage,
          video
        );

        // Get the newly created testimony by ID
        const newTestimony = await getUserTestimonyById(
          user.uid,
          newTestimonyId
        );

        if (newTestimony) {
          // Refresh testimonies list and set current testimony
          const updatedTestimonies = await getUserTestimonies(user.uid);
          setUserTestimonies(updatedTestimonies);
          setCurrentTestimony(newTestimony);

          // Prepare to connect to a soul
          prepareConnectStep(newTestimony);
        } else {
          setErrorState("Failed to retrieve the newly created testimony.");
        }
      }
    } catch (error) {
      console.error("Error submitting/updating testimony:", error);
      setErrorState("Failed to save testimony. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle connecting a testimony to a soul
  const handleClaimSubmit = async (selectedSoulId) => {
    try {
      setLoading(true);
      setErrorState("");

      let soulId;

      if (matchingSouls.length > 0 && selectedSoulId) {
        // Use existing soul
        soulId = selectedSoulId;
      } else {
        // Create new soul
        const fullName = getFullName(profile);
        const newSoul = {
          name: fullName,
          userId: user.uid,
          email: profile.email || user.email,
          createdAt: new Date().toISOString(),
          status: "active",
          isPublic: false,
        };

        soulId = await addSoul(newSoul);
      }

      // Link the testimony to the soul and update status to pending
      await linkTestimonyToSoulRecord(currentTestimony.id, soulId);

      // Get the updated testimony
      const updatedTestimony = await getUserTestimonyById(
        user.uid,
        currentTestimony.id
      );

      if (updatedTestimony) {
        // Refresh testimonies list and set current testimony
        const updatedTestimonies = await getUserTestimonies(user.uid);
        setUserTestimonies(updatedTestimonies);
        setCurrentTestimony(updatedTestimony);

        // Move to confirmation step
        setCurrentStep(3);
      } else {
        setErrorState("Failed to retrieve the updated testimony.");
      }
    } catch (error) {
      console.error("Error connecting testimony to soul:", error);
      setErrorState("Failed to connect testimony. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromClaims = () => {
    // Go back to form/read step
    setCurrentStep(1);
  };

  // Function to start a new testimony
  const handleNewTestimony = () => {
    setCurrentTestimony(null);
    setBeforeImage(null);
    setAfterImage(null);
    setVideo(null);
    setIsEditing(true);
    setCurrentStep(1);
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

    // Handle different steps and states
    switch (currentStep) {
      case 1: // Form/View/Edit step
        if (isEditing) {
          // Edit mode - show form to create or edit testimony
          return (
            <EditTestimony
              initialTestimony={currentTestimony}
              initialBeforeImage={beforeImage}
              initialAfterImage={afterImage}
              initialVideo={video}
              onSubmit={handleSubmitTestimony}
              onCancel={handleCancelEdit}
              loading={loading}
              errorState={errorState}
              isEdit={!!currentTestimony}
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

      case 2: // Connect step
        return (
          <ConnectTestimony
            matchingSouls={matchingSouls}
            onSubmit={handleClaimSubmit}
            onBack={handleBackFromClaims}
            loading={loading}
            errorState={errorState}
            colors={colors}
          />
        );

      case 3: // Confirmation step
        return (
          <ConfirmationPage
            colors={colors}
            onNavigateToDashboard={navigateToDashboard}
          />
        );

      default:
        return null;
    }
  };

  // If profile is incomplete, show the ProfileIncomplete component
  if (!profileComplete) {
    return (
      <FormContainer style={{ backgroundColor: colors.background }}>
        <ProfileIncomplete
          missingFields={missingFields}
          colors={colors}
          onCompleteProfile={handleCompleteProfile}
          onBack={handleBackPress}
        />
      </FormContainer>
    );
  }

  return (
    <FormContainer
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.contentContainer,
        currentStep === 3 && { justifyContent: "center" },
      ]}
    >
      {currentStep !== 3 && (
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={currentStep === 1 ? handleBackPress : handleBackFromClaims}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {/* Show header for steps 1 and 2 */}
      {currentStep !== 3 && !isEditing && currentTestimony && (
        <View style={styles.headerContainer}>
          <HeaderText>
            {currentStep === 1 ? "My Testimony" : "Connect Your Testimony"}
          </HeaderText>
          <SubtitleText>
            {currentStep === 1
              ? "View and manage your testimony"
              : "Link your testimony to your name on The Wall"}
          </SubtitleText>
        </View>
      )}

      {/* Main content */}
      {currentStep === 3 ? (
        renderContent()
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={styles.inner}>{renderContent()}</View>
        </ScrollView>
      )}

      {/* Action buttons for testimony management */}
      {currentStep === 1 &&
        !isEditing &&
        canSubmit &&
        userTestimonies.length > 0 && (
          <View style={styles.floatingButtonContainer}>
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
  floatingButtonContainer: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 100,
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
