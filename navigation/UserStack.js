import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import {
  DashboardScreen,
  MyWallScreen,
  TestimonySubmissionScreen,
  EmailVerificationScreen,
  ResourceManagerScreen,
  ConfigurationManagerScreen,
} from "screens";
import { TestimonyReviewScreen } from "@screens/user/TestimonyReviewScreen";
import { DashboardAdminScreen } from "screens/user/DashboardAdminScreen";
import { TestimonySubmissionSuccessScreen } from "screens/user/TestimonySubmissionSuccessScreen";
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
      <Stack.Screen name="MyWall" component={MyWallScreen} />
      <Stack.Screen name="Testimony" component={TestimonySubmissionScreen} />
      <Stack.Screen name="TestimonyReview" component={TestimonyReviewScreen} />
      <Stack.Screen
        name="TestimonySubmissionSuccess"
        component={TestimonySubmissionSuccessScreen}
      />
      <Stack.Screen name="ResourceManager" component={ResourceManagerScreen} />
      <Stack.Screen
        name="ConfigurationManager"
        component={ConfigurationManagerScreen}
      />
    </Stack.Navigator>
  );
};
