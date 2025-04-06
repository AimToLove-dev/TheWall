"use client";

import { Image } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Header = ({ onMenuPress }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleLogoPress = () => {
    navigation.navigate("Home");
  };

  return (
    <Appbar.Header
      mode="small"
      elevated
      style={{
        backgroundColor: theme.colors.surface,
        marginTop: insets.top,
      }}
    >
      <Appbar.Action
        icon={() => (
          <Image
            source={require("assets/TheWall.png")}
            style={{ width: 83, height: 40 }}
            resizeMode="cover"
          />
        )}
        onPress={handleLogoPress}
        style={{ marginRight: "auto" }}
      />
      <Appbar.Action icon="menu" size={28} onPress={onMenuPress} />
    </Appbar.Header>
  );
};
