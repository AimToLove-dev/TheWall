import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderText } from "./Typography";
import { getThemeColors, spacing } from "../styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Header = ({ onMenuPress }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();

  const handleLogoPress = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Logo */}
      <TouchableOpacity style={styles.logoButton} onPress={handleLogoPress}>
        <Image
          source={require("assets/TheWall.png")} // Replace with your logo path
          style={[styles.logoImage]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Ionicons name="menu" size={28} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  logoButton: {
    padding: spacing.xs,
  },
  logoImage: {
    width: 83,
    height: 40,
  },
  menuButton: {
    padding: spacing.xs,
  },
});
