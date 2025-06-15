import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InstanceSelectScreen } from "~/modules/standalone";

export type TStackNavigationRoutes = {
  InstanceSelectScreen: undefined;
};

const Stack = createNativeStackNavigator<TStackNavigationRoutes>();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="InstanceSelectScreen"
        component={InstanceSelectScreen}
      />
    </Stack.Navigator>
  );
}
