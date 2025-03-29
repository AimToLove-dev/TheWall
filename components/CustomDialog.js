import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { View } from "./View";
import { HeaderText, BodyText } from "./Typography";
import { CustomButton } from "./CustomButton";
import { getThemeColors, spacing } from "../styles/theme";

export const CustomDialog = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  cancelVariant = "outline",
  isDestructive = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialogContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <HeaderText style={styles.title}>{title}</HeaderText>
              <BodyText
                style={[styles.message, { color: colors.textSecondary }]}
              >
                {message}
              </BodyText>

              <View style={styles.buttonContainer}>
                {onCancel && (
                  <CustomButton
                    title={cancelText}
                    onPress={onCancel}
                    variant={cancelVariant}
                    style={[styles.button, styles.cancelButton]}
                  />
                )}

                {onConfirm && (
                  <CustomButton
                    title={confirmText}
                    onPress={onConfirm}
                    variant={isDestructive ? "outline" : confirmVariant}
                    style={[
                      styles.button,
                      isDestructive && { borderColor: colors.error },
                    ]}
                    textStyle={isDestructive && { color: colors.error }}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: spacing.lg,
  },
  dialogContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    minWidth: 120,
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    marginRight: spacing.sm,
  },
});
