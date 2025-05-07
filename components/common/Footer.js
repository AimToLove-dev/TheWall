import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CaptionText } from "..";
import { Linking } from "react-native";
import { Button, Text } from "react-native";
import { Snackbar } from "react-native-paper";

const Footer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Hardcoded social links as requested
  const socialLinks = {
    facebook: "https://www.facebook.com/AIM2LOVE1",
    tiktok: "https://www.tiktok.com/@aimtolove",
    instagram: "https://www.instagram.com/aim_tolove",
    twitter: "https://twitter.com/aimtolove_?",
  };

  // Mailchimp form HTML
  const mailchimpFormHTML = `
    <div id="mc_embed_signup">
      <form action="https://aimtolove.us19.list-manage.com/subscribe/post?u=186451ee2ea673e938f0359d4&id=f6955c3037&f_id=000187e4f0" 
            method="post" 
            id="mc-embedded-subscribe-form" 
            name="mc-embedded-subscribe-form" 
            target="_blank">
        <input type="email" name="EMAIL" value="${email}" style="display:none" />
        <input type="text" name="FNAME" value="${firstName}" style="display:none" />
        <input type="text" name="LNAME" value="${lastName}" style="display:none" />
        <div style="position: absolute; left: -5000px;" aria-hidden="true">
          <input type="text" name="b_186451ee2ea673e938f0359d4_f6955c3037" tabindex="-1" value="" />
        </div>
      </form>
    </div>
  `;

  // Reference to the hidden form
  const formRef = React.useRef(null);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubscribe = async () => {
    if (!email || !firstName || !lastName) {
      showSnackbar("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the form using the HTML form
      if (formRef.current) {
        const form = formRef.current.querySelector("form");
        if (form) {
          form.submit();
          showSnackbar("Thank you for subscribing!");
          setModalVisible(false);
          setEmail("");
          setFirstName("");
          setLastName("");
        } else {
          showSnackbar("Form not found. Please try again.");
        }
      } else {
        showSnackbar("Form not found. Please try again.");
      }
    } catch (error) {
      showSnackbar("There was an issue connecting to the server.");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("assets/brickSeamless.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="repeat"
      >
        <View style={styles.pageFooter}>
          <View style={styles.footerContent}>
            {/* About Section */}
            <View style={styles.footerSection}>
              <Image
                source={require("assets/pillars.png")}
                style={{
                  width: 120,
                  height: 20,
                  marginLeft: 10,
                  marginTop: "auto",
                  marginBottom: -8,
                  alignSelf: "flex-start",
                }}
                resizeMode="cover"
              />
            </View>

            {/* Social Media Section */}
            <View style={styles.footerSection}>
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.facebook)}
                >
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.twitter)}
                >
                  <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.tiktok)}
                >
                  <Ionicons name="logo-tiktok" size={24} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(socialLinks.instagram)}
                >
                  <Ionicons name="logo-instagram" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Subscribe Section */}
            <View style={styles.footerSection}>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.subscribeText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Hidden container for the Mailchimp form */}
      <div
        ref={formRef}
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: mailchimpFormHTML }}
      />

      {/* Mailchimp Subscription Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Subscribe</Text>
              <Text style={styles.requiredText}>* indicates required</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Your first name"
                  placeholderTextColor="#999"
                  required
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Last Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Your last name"
                  placeholderTextColor="#999"
                  required
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubscribe}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitText}>
                    {isSubmitting ? "Submitting..." : "Subscribe"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.poweredBy}>
                <Text style={styles.poweredByText}>Powered by Mailchimp</Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50, // Section height is 50px
    overflow: "hidden", // This prevents content from overflowing
  },
  backgroundImage: {
    width: "100%",
    height: 200, // Background image is 200px tall
  },
  backgroundImageStyle: {
    height: 200, // Ensure background image is 200px tall
  },
  pageFooter: {
    height: 50, // Keep the footer content at 50px height
    justifyContent: "center", // Center content vertically
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  footerContent: {
    maxWidth: "min(100vw,800px)",
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  footerSection: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 2, // Reduced margin to fit in 50px height
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  subscribeButton: {
    backgroundColor: "#0074D9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  subscribeText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: "80%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  requiredText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    textAlign: "right",
  },
  required: {
    color: "red",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#0074D9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  poweredBy: {
    alignItems: "center",
    marginTop: 10,
  },
  poweredByText: {
    color: "#666",
    fontSize: 12,
  },
});

export default Footer;
