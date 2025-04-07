import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import {
  ProfileScreen,
  DashboardScreen,
  MyWallScreen,
  MyTestimonyScreen,
  EmailVerificationScreen,
} from "screens";
import { TestimonyAdminScreen } from "screens/user/TestimonyAdminScreen";
import { DashboardAdminScreen } from "screens/user/DashboardAdminScreen";
import { AuthenticatedUserContext } from "../providers";

const Stack = createStackNavigator();

export const UserStack = () => {
  const { user, isEmailVerified } = useContext(AuthenticatedUserContext);

  // All users must verify their email - no exceptions
  if (user && !isEmailVerified) {
    return <EmailVerificationScreen />;
  }

  // Normal authenticated user flow
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyWall" component={MyWallScreen} />
      <Stack.Screen name="MyTestimony" component={MyTestimonyScreen} />
      <Stack.Screen name="TestimonyAdmin" component={TestimonyAdminScreen} />
    </Stack.Navigator>
  );
};
