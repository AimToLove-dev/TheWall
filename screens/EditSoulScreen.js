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
import { updateSoul } from "../utils/firebaseUtils";

const soulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  contact: Yup.string().required("Phone or email is required"),
});

export const EditSoulScreen = ({ navigation, route }) => {
  const { soul } = route.params;
  const { user } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  // Get initial contact value (either email or phone)
  const initialContact = soul.email || soul.phone || "";

  const handleUpdateSoul = async (values) => {
    if (!user) {
      setErrorState("You must be logged in to update a soul");
      return;
    }

    setLoading(true);
    setErrorState("");

    try {
      // Determine if contact is email or phone
      const isEmail = values.contact.includes("@");

      // Update soul in Firestore
      await updateSoul(soul.id, {
        name: values.name,
        ...(isEmail
          ? { email: values.contact, phone: null }
          : { phone: values.contact, email: null }),
      });

      Alert.alert(
        "Soul Updated",
        `${values.name}'s information has been updated`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error updating soul:", error);
      setErrorState("Failed to update soul. Please try again.");
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
          <HeaderText>Edit Soul</HeaderText>
          <SubtitleText>Update the information for this soul</SubtitleText>
        </View>

        <Formik
          initialValues={{
            name: soul.name || "",
            contact: initialContact,
          }}
          validationSchema={soulValidationSchema}
          onSubmit={handleUpdateSoul}
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
                title="Update"
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
