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
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "providers";
import {
  CustomButton,
  FormContainer,
  TextAreaInput,
  MediaUpload,
  VideoUpload,
} from "components";
import { ProfileIncomplete } from "components/ProfileIncomplete";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
} from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import { submitTestimony, canAddMoreTestimonies } from "utils/testimoniesUtils";
import { checkProfileCompleteness, getFullName } from "@utils/profileUtils";

// Validation schema for the testimony form
const testimonyValidationSchema = Yup.object().shape({
  testimony: Yup.string()
    .required("Testimony is required")
    .min(50, "Testimony must be at least 50 characters")
    .max(2000, "Testimony must be less than 2000 characters"),
});

export const MyTestimonyScreen = ({ navigation }) => {
  const { user, profile } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [missingFields, setMissingFields] = useState([]);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  // Check if user profile is complete and if they can submit more testimonies
  useEffect(() => {
    if (user) {
      // Check profile completeness
      const { isComplete, missingFields } = checkProfileCompleteness(profile);
      setProfileComplete(isComplete);
      setMissingFields(missingFields);

      // Check submission limit
      const checkSubmissionLimit = async () => {
        const canAdd = await canAddMoreTestimonies(user.uid, user.isAdmin);
        setCanSubmit(canAdd);

        if (!canAdd) {
          Alert.alert(
            "Submission Limit Reached",
            "You have reached the maximum number of testimony submissions. Please contact support for assistance."
          );
        }
      };

      checkSubmissionLimit();
    }
  }, [user]);

  const handleCompleteProfile = () => {
    navigation.navigate("Profile", { startEditing: true });
  };

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

    if (!canSubmit) {
      setErrorState(
        "You have reached the maximum number of testimony submissions"
      );
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      const testimonyData = {
        ...values,
        userId: profile.uid || user.uid,
        userEmail: profile.email,
        displayName: getFullName(profile),
        phoneNumber: profile?.phoneNumber,
        address: profile?.address,
        dob: profile?.dob,
      };

      await submitTestimony(testimonyData, beforeImage, afterImage, video);

      Alert.alert(
        "Testimony Submitted",
        "Your testimony has been submitted successfully and is pending review.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Dashboard"),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting testimony:", error);
      setErrorState("Failed to submit testimony. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
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
      contentContainerStyle={styles.contentContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <TouchableOpacity
            style={[
              styles.backButton,
              isDark && { backgroundColor: colors.card },
            ]}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <HeaderText>Share Your Testimony</HeaderText>
            <SubtitleText>
              Tell us your story and inspire others with your journey
            </SubtitleText>
          </View>

          <Formik
            initialValues={{ testimony: "" }}
            validationSchema={testimonyValidationSchema}
            onSubmit={handleSubmitTestimony}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <View style={styles.formContainer}>
                <View style={styles.profileInfoCard}>
                  <BodyText style={styles.profileInfoTitle}>
                    Your Information
                  </BodyText>
                  <View style={styles.profileInfoRow}>
                    <BodyText style={styles.profileInfoLabel}>Name:</BodyText>
                    <BodyText>
                      {profile?.firstName} {profile?.lastName}
                    </BodyText>
                  </View>
                  <View style={styles.profileInfoRow}>
                    <BodyText style={styles.profileInfoLabel}>Email:</BodyText>
                    <BodyText>{profile?.email}</BodyText>
                  </View>
                  <View style={styles.profileInfoRow}>
                    <BodyText style={styles.profileInfoLabel}>Phone:</BodyText>
                    <BodyText>{profile?.phoneNumber}</BodyText>
                  </View>
                  <TouchableOpacity
                    style={styles.editProfileLink}
                    onPress={() => navigation.navigate("Profile")}
                  >
                    <BodyText style={{ color: colors.primary }}>
                      Edit Profile
                    </BodyText>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                <TextAreaInput
                  label="Your Testimony"
                  placeholder="Share your story here (minimum 50 characters)"
                  value={values.testimony}
                  onChangeText={handleChange("testimony")}
                  onBlur={handleBlur("testimony")}
                  error={errors.testimony}
                  touched={touched.testimony}
                  numberOfLines={8}
                  maxLength={2000}
                />

                <View style={styles.mediaSection}>
                  <BodyText style={styles.mediaSectionTitle}>
                    Add Media (Optional)
                  </BodyText>

                  <View style={styles.imageRow}>
                    <MediaUpload
                      label="Before Image"
                      imageUri={beforeImage}
                      onImageSelected={setBeforeImage}
                      style={styles.imageUpload}
                      placeholder="Before"
                    />

                    <MediaUpload
                      label="After Image"
                      imageUri={afterImage}
                      onImageSelected={setAfterImage}
                      style={styles.imageUpload}
                      placeholder="After"
                    />
                  </View>

                  <VideoUpload
                    label="Your Story Video"
                    videoUri={video}
                    onVideoSelected={setVideo}
                    placeholder="Share a short video of your story"
                    maxDuration={120} // 2 minutes
                  />
                </View>

                {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

                <CustomButton
                  title="Submit Testimony"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading || !canSubmit}
                  variant="primary"
                  size="large"
                  style={styles.submitButton}
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  inner: {
    flex: 1,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#F0F0F0",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  profileInfoCard: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  profileInfoTitle: {
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  profileInfoRow: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  profileInfoLabel: {
    fontWeight: "500",
    marginRight: spacing.sm,
    width: 60,
  },
  editProfileLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: spacing.sm,
  },
  mediaSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  mediaSectionTitle: {
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  imageUpload: {
    flex: 1,
    marginRight: spacing.md,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  incompleteProfileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  incompleteTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  incompleteSubtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  missingFieldsContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  missingFieldsTitle: {
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  missingFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  missingFieldText: {
    marginLeft: spacing.xs,
  },
  completeProfileButton: {
    width: "100%",
    maxWidth: 400,
  },
});
