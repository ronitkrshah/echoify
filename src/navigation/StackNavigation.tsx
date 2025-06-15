import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InstanceSelectScreen } from "~/features/standalone";
import BottomTabsNavigation, { TBottomTabRoutes } from "./BottomTabNavigation";
import { SearchScreen } from "~/features/search";

export type TStackNavigationRoutes = {
  InstanceSelectScreen: undefined;
  SearchScreen: { query: string };
  BottomTabNavigation: NavigatorScreenParams<TBottomTabRoutes>;
};

const Stack = createNativeStackNavigator<TStackNavigationRoutes>();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InstanceSelectScreen" component={InstanceSelectScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="BottomTabNavigation" component={BottomTabsNavigation} />
    </Stack.Navigator>
  );
}
