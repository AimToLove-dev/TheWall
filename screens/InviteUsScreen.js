import React from "react";
import { ComingSoon } from "../components/ComingSoon";
import { useNavigation } from "@react-navigation/native";

export const InviteUsScreen = () => {
  const navigation = useNavigation();

  return (
    <ComingSoon
      title="INVITE US"
      description="A sound of love and liberation. Learn how to invite our speakers and leaders to your church or organization to share testimonies and bring hope to your community."
      imageSrc={require("assets/connect.png")}
      onGoBack={() => navigation.navigate("Home")}
    />
  );
};
