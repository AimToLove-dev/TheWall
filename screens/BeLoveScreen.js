import React from "react";
import { ComingSoon } from "../components/ComingSoon";
import { useNavigation } from "@react-navigation/native";

export const BeLoveScreen = () => {
  const navigation = useNavigation();

  return (
    <ComingSoon
      title="BE LOVE"
      description="Our mission is to empower Christians to love and evangelize the LGBTQ+ community with compassion and understanding. This platform will offer resources, training, and community support."
      imageSrc={require("assets/flame.png")}
      onGoBack={() => navigation.navigate("Home")}
    />
  );
};
