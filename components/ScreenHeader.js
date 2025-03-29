import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderText } from "./Typography";
import { getThemeColors, spacing } from "../styles/theme";

/**
 * A reusable screen header component with a back button and title
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The header title
 * @param {Function} props.onBackPress - Function to call when back button is pressed
 * @param {boolean} props.showBackButton - Whether to show the back button (default: true)
 * @param {React.ReactNode} props.rightContent - Optional content to display on the right side
 * @param {Object} props.style - Additional styles for the header container
 * @param {Object} props.titleStyle - Additional styles for the title text
 * @returns {React.ReactElement} ScreenHeader component
 */
export const ScreenHeader = ({
  title,
  onBackPress,
  showBackButton = true,
  rightContent,
  style,
  titleStyle,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  return (
    <View style={[styles.header, style]}>
      {showBackButton && (
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {title && (
        <HeaderText style={[styles.title, titleStyle]}>{title}</HeaderText>
      )}

      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  title: {
    flex: 1,
  },
  rightContent: {
    marginLeft: "auto",
  },
});
