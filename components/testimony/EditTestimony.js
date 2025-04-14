import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomButton, CustomInput } from "components";
import { TextAreaInput, MediaUpload, VideoUpload } from "components/inputs";
import { ProfileInfoCard } from "components/profile/ProfileInfoCard";
import { AuthenticatedUserContext } from "providers";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
} from "components/Typography";
import { spacing } from "styles/theme";
import { Ionicons } from "@expo/vector-icons";

// Validation schema for the testimony form
const testimonyValidationSchema = Yup.object().shape({
  testimony: Yup.string()
    .required("Testimony is required")
    .min(50, "Testimony must be at least 50 characters")
    .max(2000, "Testimony must be less than 2000 characters"),
});

export const EditTestimony = ({
  initialTestimony,
  onSubmit,
  onCancel,
  loading,
  errorState,
  isEdit = true, // Set to false for creating a new testimony
  onEditProfile, // Function to handle editing profile
  profileData, // Profile data to display
  isAdmin = false, // Whether the current user is an admin
}) => {
  const [beforeImage, setBeforeImage] = useState(
    initialTestimony?.beforeImage || null
  );
  const [afterImage, setAfterImage] = useState(
    initialTestimony?.afterImage || null
  );
  const [video, setVideo] = useState(
    initialTestimony?.video ||
      initialTestimony?.videoUrl ||
      initialTestimony?.videoUri ||
      null
  );

  // Faith-related questions states with "NotSet" as default if no value provided
  const [believeJesusSonOfGod, setBelieveJesusSonOfGod] = useState(
    initialTestimony?.believeJesusSonOfGod || "NotSet"
  );
  const [believeJesusResurrection, setBelieveJesusResurrection] = useState(
    initialTestimony?.believeJesusResurrection || "NotSet"
  );
  const [repentedFromSins, setRepentedFromSins] = useState(
    initialTestimony?.repentedFromSins || "NotSet"
  );
  const [confessJesusLord, setConfessJesusLord] = useState(
    initialTestimony?.confessJesusLord || "NotSet"
  );
  const [bornAgain, setBornAgain] = useState(
    initialTestimony?.bornAgain || "NotSet"
  );
  const [baptizedHolySpirit, setBaptizedHolySpirit] = useState(
    initialTestimony?.baptizedHolySpirit || "NotSet"
  );

  // Sexuality-related questions states
  const [struggleSameSexAttraction, setStruggleSameSexAttraction] = useState(
    initialTestimony?.struggleSameSexAttraction || "NotSet"
  );
  const [identifyAsLGBTQ, setIdentifyAsLGBTQ] = useState(
    initialTestimony?.identifyAsLGBTQ || "NotSet"
  );
  const [vowPurity, setVowPurity] = useState(
    initialTestimony?.vowPurity || "NotSet"
  );
  const [emotionallyDependentSameSex, setEmotionallyDependentSameSex] =
    useState(initialTestimony?.emotionallyDependentSameSex || "NotSet");
  const [healedFromHomosexuality, setHealedFromHomosexuality] = useState(
    initialTestimony?.healedFromHomosexuality || "NotSet"
  );
  const [repentedHomosexuality, setRepentedHomosexuality] = useState(
    initialTestimony?.repentedHomosexuality || "NotSet"
  );

  // Same-sex attraction options
  const sameSexAttractionOptions = [
    "Yes, but I pick up my cross and I deny myself from acting on same-sex attraction.",
    "Yes, and I still have relationships (emotionally and/or physically) with the same sex.",
    "No, I do not struggle with same-sex attraction.",
    "I'm not sure.",
  ];

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      beforeImage,
      afterImage,
      video,
      videoUrl: video, // Adding videoUrl for consistency
      videoUri: video, // Adding videoUri for consistency
      // Include faith-related questions
      believeJesusSonOfGod,
      believeJesusResurrection,
      repentedFromSins,
      confessJesusLord,
      bornAgain,
      baptizedHolySpirit,
      // Include sexuality-related questions
      struggleSameSexAttraction,
      identifyAsLGBTQ,
      vowPurity,
      emotionallyDependentSameSex,
      healedFromHomosexuality,
      repentedHomosexuality,
    });
  };

  // Helper function to render a checkbox item
  const renderCheckboxItem = (question, value, setValue) => {
    return (
      <View style={styles.checkboxItem}>
        <BodyText style={styles.checkboxQuestion}>{question}</BodyText>
        <View style={styles.checkboxOptions}>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => setValue("Yes")}
          >
            <View
              style={[
                styles.checkbox,
                value === "Yes" && {
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                },
              ]}
            >
              {value === "Yes" && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <BodyText style={styles.optionLabel}>Yes</BodyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => setValue("No")}
          >
            <View
              style={[
                styles.checkbox,
                value === "No" && {
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                },
              ]}
            >
              {value === "No" && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <BodyText style={styles.optionLabel}>No</BodyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => setValue("NotSet")}
          >
            <View
              style={[
                styles.clearOption,
                value === "NotSet" && {
                  borderColor: "#888888",
                  borderWidth: 2,
                },
              ]}
            >
              {value === "NotSet" && (
                <Ionicons name="remove" size={12} color="#888888" />
              )}
            </View>
            <BodyText style={styles.clearLabel}>Clear</BodyText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Helper function to render a radio selection with multiple options
  const renderRadioItem = (question, value, setValue, options) => {
    return (
      <View style={styles.radioItem}>
        <BodyText style={styles.checkboxQuestion}>{question}</BodyText>

        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioOptionContainer}
            onPress={() => setValue(option)}
          >
            <View
              style={[
                styles.radioButton,
                value === option && { borderColor: "#4CAF50", borderWidth: 2 },
              ]}
            >
              {value === option && <View style={styles.radioSelected} />}
            </View>
            <BodyText
              style={[
                styles.radioLabel,
                value === option && { fontWeight: "500", color: "#4CAF50" },
              ]}
            >
              {option}
            </BodyText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.clearRadioOption}
          onPress={() => setValue("NotSet")}
        >
          <View
            style={[
              styles.clearOption,
              value === "NotSet" && { borderColor: "#888888", borderWidth: 2 },
            ]}
          >
            {value === "NotSet" && (
              <Ionicons name="remove" size={12} color="#888888" />
            )}
          </View>
          <BodyText style={styles.clearLabel}>Clear selection</BodyText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderText style={styles.headerText}>
        {isEdit ? "Edit Testimony" : "Create Testimony"}
      </HeaderText>
      <SubtitleText style={styles.subHeaderText}>
        {isEdit
          ? "Make changes to your testimony below"
          : "Share your story and inspire others with your journey"}
      </SubtitleText>

      <Formik
        initialValues={{
          testimony: initialTestimony?.testimony || "",
          title: initialTestimony?.title || "",
          beforeImage: initialTestimony?.beforeImage || null,
          afterImage: initialTestimony?.afterImage || null,
          video:
            initialTestimony?.video ||
            initialTestimony?.videoUrl ||
            initialTestimony?.videoUri ||
            null,
        }}
        validationSchema={testimonyValidationSchema}
        onSubmit={handleSubmit}
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
            {isAdmin && (
              <CustomInput
                label="Testimony Title"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                placeholder="Enter a title for this testimony"
                style={{ marginBottom: spacing.md }}
              />
            )}

            {/* Profile Information Card */}
            {profileData && (
              <View style={styles.profileInfoSection}>
                <ProfileInfoCard
                  profileData={profileData}
                  isAdmin={isAdmin}
                  onEditProfile={onEditProfile}
                />
              </View>
            )}

            {/* Faith questions section */}
            <View style={styles.faithSection}>
              <BodyText style={styles.mediaSectionTitle}>
                Faith Questions
              </BodyText>
              <BodyText style={styles.faithInstructions}>
                Please answer the following questions about your faith. You may
                leave questions unanswered if you prefer.
              </BodyText>

              {renderCheckboxItem(
                "Do you believe that Jesus is the Son of God?",
                believeJesusSonOfGod,
                setBelieveJesusSonOfGod
              )}

              {renderCheckboxItem(
                "Do you believe that Jesus was crucified on the cross and rose from the dead?",
                believeJesusResurrection,
                setBelieveJesusResurrection
              )}

              {renderCheckboxItem(
                "Have you repented from your sins? (sin referring to actions, thoughts, or behaviors that go against God's will and commands)",
                repentedFromSins,
                setRepentedFromSins
              )}

              {renderCheckboxItem(
                "Do you confess Jesus as your Lord and Savior?",
                confessJesusLord,
                setConfessJesusLord
              )}

              {renderCheckboxItem(
                "Do you consider yourself born again?",
                bornAgain,
                setBornAgain
              )}

              {renderCheckboxItem(
                "Do you consider yourself as baptized with the Holy Spirit?",
                baptizedHolySpirit,
                setBaptizedHolySpirit
              )}
            </View>

            {/* Sexuality questions section */}
            <View style={styles.sexualitySection}>
              <BodyText style={styles.mediaSectionTitle}>
                Sexuality Questions
              </BodyText>
              <BodyText style={styles.faithInstructions}>
                These questions help us understand your journey. You may leave
                questions unanswered if you prefer.
              </BodyText>

              {renderRadioItem(
                "Do you claim to still struggle with same-sex attraction?",
                struggleSameSexAttraction,
                setStruggleSameSexAttraction,
                sameSexAttractionOptions
              )}

              {renderCheckboxItem(
                "Do you identify as part of the LGBTQ+ community?",
                identifyAsLGBTQ,
                setIdentifyAsLGBTQ
              )}

              {renderCheckboxItem(
                "Do you vow purity and holiness over your body?",
                vowPurity,
                setVowPurity
              )}

              {renderCheckboxItem(
                "Do you have any emotionally dependent relationships with the same sex?",
                emotionallyDependentSameSex,
                setEmotionallyDependentSameSex
              )}

              {renderCheckboxItem(
                "Have you been delivered and/or healed from homosexuality?",
                healedFromHomosexuality,
                setHealedFromHomosexuality
              )}

              {renderCheckboxItem(
                "Have you repented and renounced homosexuality?",
                repentedHomosexuality,
                setRepentedHomosexuality
              )}
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
                  initialImage={beforeImage}
                  onImageSelect={setBeforeImage}
                  style={styles.imageUpload}
                />

                <MediaUpload
                  label="After Image"
                  initialImage={afterImage}
                  onImageSelect={setAfterImage}
                  style={styles.imageUpload}
                />
              </View>

              <VideoUpload
                label="Your Story Video"
                initialVideo={video}
                onVideoSelect={setVideo}
                placeholder="Share a short video of your story"
                maxDuration={120} // 2 minutes
              />
            </View>

            {errorState ? <ErrorText>{errorState}</ErrorText> : null}

            <View style={styles.actionsContainer}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={onCancel}
                style={styles.actionButton}
              />
              <CustomButton
                title={isEdit ? "Save Changes" : "Submit"}
                variant="primary"
                onPress={handleSubmit}
                loading={loading}
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  headerText: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subHeaderText: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  mediaSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  faithSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  faithInstructions: {
    marginBottom: spacing.md,
    fontStyle: "italic",
    fontSize: 14,
    opacity: 0.7,
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
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  checkboxItem: {
    marginBottom: spacing.md,
  },
  checkboxQuestion: {
    marginBottom: spacing.xs,
  },
  checkboxOptions: {
    flexDirection: "row",
    marginTop: spacing.xs / 2,
    flexWrap: "wrap",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.xs / 2,
  },
  clearOption: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.xs / 2,
  },
  optionLabel: {
    fontSize: 14,
  },
  clearLabel: {
    fontSize: 14,
    color: "#888888",
  },
  sexualitySection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  radioItem: {
    marginBottom: spacing.lg,
  },
  radioOptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    marginRight: spacing.sm,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    backgroundColor: "#4CAF50",
  },
  radioLabel: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  clearRadioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  profileInfoSection: {
    marginBottom: spacing.lg,
  },
});
