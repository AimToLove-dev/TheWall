"use client";

import { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "../providers";
import { CustomInput, CustomButton, FormContainer } from "../components";
import { HeaderText, SubtitleText, ErrorText } from "../components/Typography";
import { getThemeColors } from "../styles/theme";
import { addSoul, canAddMoreSouls } from "../utils/firebaseUtils";

const soulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  contact: Yup.string().required("Phone or email is required"),
});

export const AddSoulScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const handleAddSoul = async (values) => {
    if (!user) {
      setErrorState("You must be logged in to add a soul");
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      // Check if user can add more souls
      const canAdd = await canAddMoreSouls(user.uid, user.isAdmin);

      if (!canAdd) {
        setErrorState("You have reached the maximum limit of 7 souls");
        setLoading(false);
        return;
      }

      // Determine if contact is email or phone
      const isEmail = values.contact.includes("@");

      // Add soul to Firestore
      await addSoul({
        name: values.name,
        ...(isEmail ? { email: values.contact } : { phone: values.contact }),
        userId: user.uid,
      });

      Alert.alert(
        "Soul Added",
        `${values.name} has been added to the Wailing Wall`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error adding soul:", error);
      setErrorState("Failed to add soul. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    return (
      <View style={styles.inner}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <HeaderText>Add to Wailing Wall</HeaderText>
          <SubtitleText>
            Enter the name and contact information of the person you want to add
            to the wall
          </SubtitleText>
        </View>

        <Formik
          initialValues={{ name: "", contact: "" }}
          validationSchema={soulValidationSchema}
          onSubmit={handleAddSoul}
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
              <CustomInput
                label="Name"
                placeholder="Enter name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={errors.name}
                touched={touched.name}
                leftIconName="person-outline"
              />

              <CustomInput
                label="Phone or Email"
                placeholder="Enter phone or email"
                value={values.contact}
                onChangeText={handleChange("contact")}
                onBlur={handleBlur("contact")}
                error={errors.contact}
                touched={touched.contact}
                leftIconName="call-outline"
              />

              {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

              <CustomButton
                title="Add to Wall"
                onPress={() => handleSubmit()}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>
      </View>
    );
  };

  return (
    <FormContainer
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.contentContainer}
    >
      {renderContent()}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  // Styles remain the same
});
