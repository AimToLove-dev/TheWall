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
  ProfileIncomplete,
  ReadTestimony,
  EditTestimony,
  EditProfileForm,
} from "components";
import { ProfileInfoCard } from "components/profile/ProfileInfoCard";
import { HeaderText, SubtitleText, BodyText } from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import {
  submitTestimony,
  canAddMoreTestimonies,
  getUserTestimonies,
  getUserTestimonyById,
  updateTestimony,
} from "utils/testimoniesUtils";
import { checkProfileCompleteness, getFullName } from "@utils/profileUtils";

export const TestimonySubmissionScreen = ({ navigation }) => {
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

  const [isAdminSubmission, setIsAdminSubmission] = useState(false);
  const [adminSubmissionProfile, setAdminSubmissionProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    uid: user?.uid, // Admin's UID as the submitter
  });

  // Check if the current user is an admin
  const isAdmin = profile?.isAdmin || user?.isAdmin;

  const colors = getThemeColors();

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

  const handleCompleteProfile = () => {
    navigation.navigate("Profile", { startEditing: true });
  };

  const handleBackPress = () => {
    navigation.goBack();
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

  // Function to submit a new testimony or update an existing one
  const handleSubmitTestimony = async (values) => {
    if (!user) {
      setErrorState("You must be logged in to submit a testimony");
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      // Prepare testimony data
      let data;

      if (isAdminSubmission && isAdmin) {
        // Admin is submitting on behalf of someone else
        data = {
          testimony: values.testimony,
          title: values.title || "",
          userId: user.uid, // Admin's UID as the submitter
          submittedByAdmin: true,
          adminEmail: user.email,
          // Use the profile data that was entered for the person
          userEmail: adminSubmissionProfile.email || "",
          displayName: `${adminSubmissionProfile?.firstName?.trim()} ${adminSubmissionProfile?.lastName
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase()}.`,
          phoneNumber: adminSubmissionProfile.phoneNumber,
          address: adminSubmissionProfile.address,
          dob: adminSubmissionProfile.dob,
        };
      } else {
        // Regular user submission with their own profile
        data = {
          testimony: values.testimony,
          title: values.title || "",
          userId: profile.uid || user.uid,
          userEmail: profile.email,
          displayName: `${profile?.firstName?.trim()} ${profile.lastName
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase()}.`,
          phoneNumber: profile?.phoneNumber,
          address: profile?.address,
          dob: profile?.dob,
        };
      }

      if (currentTestimony && currentTestimony.id) {
        // Update existing testimony
        await updateTestimony(currentTestimony.id, {
          ...data,
          // Only update media if it has changed
          ...(beforeImage !== currentTestimony.beforeImage && { beforeImage }),
          ...(afterImage !== currentTestimony.afterImage && { afterImage }),
          ...(video !== currentTestimony.video && { video }),
        });
      } else {
        // Submit new testimony
        await submitTestimony(data, beforeImage, afterImage, video);
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
    setBeforeImage(null);
    setAfterImage(null);
    setVideo(null);
    setIsEditing(true);
  };

  // Function to handle editing profile (for admin or user)
  const handleEditProfile = () => {
    if (isAdmin && isAdminSubmission) {
      // For admins, we'll show the EditProfileForm for the person they're submitting for
      setIsEditing(false); // Exit testimony editing mode if active
      setProfileComplete(false); // This will trigger showing the admin profile form
    } else {
      // For regular users, navigate to the profile screen
      navigation.navigate("Profile", { startEditing: true });
    }
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
          initialBeforeImage={beforeImage}
          initialAfterImage={afterImage}
          initialVideo={video}
          onSubmit={handleSubmitTestimony}
          onCancel={handleCancelEdit}
          loading={loading}
          errorState={errorState}
          isEdit={!!currentTestimony}
          onEditProfile={handleEditProfile}
          profileData={isAdminSubmission ? adminSubmissionProfile : profile}
          isAdmin={isAdmin && isAdminSubmission}
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
          onEditProfile={handleEditProfile}
          profileData={isAdminSubmission ? adminSubmissionProfile : profile}
          isAdmin={isAdmin && isAdminSubmission}
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

  // If profile is incomplete, show the ProfileIncomplete component for regular users
  if (!isAdmin && !profileComplete) {
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
      contentContainerStyle={[styles.contentContainer]}
    >
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <HeaderText>My Testimony</HeaderText>
        <SubtitleText>View and manage your testimony</SubtitleText>
      </View>

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
  adminProfileContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  adminProfileTitle: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  adminProfileSubtitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  adminFormContainer: {
    flex: 1,
  },
});
