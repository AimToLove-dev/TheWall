import { createStackNavigator } from "@react-navigation/stack";
import { ProfileScreen, DashboardScreen, MyWallScreen } from "../screens";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyWall" component={MyWallScreen} />
    </Stack.Navigator>
  );
};
