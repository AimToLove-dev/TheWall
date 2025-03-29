import { createStackNavigator } from "@react-navigation/stack";

import { ProfileScreen } from "../screens/ProfileScreen";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Add other authenticated screens here */}
    </Stack.Navigator>
  );
};
