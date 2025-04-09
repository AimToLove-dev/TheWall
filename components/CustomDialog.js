"use client";

import { StyleSheet } from "react-native";
import { Dialog, Portal, Text } from "react-native-paper";
import { getThemeColors } from "styles/theme";
import { CustomButton } from "./CustomButton";

export const CustomDialog = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "contained",
  cancelVariant = "outlined",
  isDestructive = false,
}) => {
  const colors = getThemeColors();

  const styles = StyleSheet.create({
    dialog: {
      backgroundColor: colors.surface,
    },
    title: {
      color: colors.text,
      fontWeight: "bold",
    },
    content: {
      color: colors.textSecondary,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    cancelButton: {
      marginRight: 8,
    },
  });

  const getConfirmVariant = () => {
    if (isDestructive) return "primary"; // We'll handle the color through style
    return "primary";
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.content}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actionsContainer}>
          {onCancel && (
            <CustomButton
              title={cancelText}
              onPress={onCancel}
              variant="outline"
              size="small"
              style={styles.cancelButton}
            />
          )}
          {onConfirm && (
            <CustomButton
              title={confirmText}
              onPress={onConfirm}
              variant={getConfirmVariant()}
              size="small"
              style={isDestructive ? { backgroundColor: colors.error } : {}}
            />
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
