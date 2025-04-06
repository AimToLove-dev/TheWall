import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import {
  ProfileScreen,
  DashboardScreen,
  MyWallScreen,
  MyTestimonyScreen,
} from "screens";

const Stack = createStackNavigator();

export const UserStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyWall" component={MyWallScreen} />
      <Stack.Screen name="MyTestimony" component={MyTestimonyScreen} />
    </Stack.Navigator>
  );
};
