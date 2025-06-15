import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InstanceSelectScreen } from "~/features/standalone";
import BottomTabsNavigation, { TBottomTabRoutes } from "./BottomTabNavigation";
import { SearchResultsScreen, SearchScreen } from "~/features/search";
import { useLayoutEffect, useState } from "react";
import { LocalStorage } from "~/utils";
import { PersistanceKeys } from "~/constants";
import { useTheme } from "react-native-paper";

export type TStackNavigationRoutes = {
  InstanceSelectScreen: undefined;
  SearchScreen: undefined;
  SearchResultsScreen: { query: string };
  BottomTabNavigation: NavigatorScreenParams<TBottomTabRoutes>;
};

const Stack = createNativeStackNavigator<TStackNavigationRoutes>();

export default function StackNavigation() {
  const theme = useTheme();
  const [initialRoute, setInitialRoute] = useState<keyof TStackNavigationRoutes>();

  useLayoutEffect(() => {
    const pipedInstance = LocalStorage.getItem(PersistanceKeys.PIPED_INSTANCE);
    if (pipedInstance !== undefined) {
      setInitialRoute("BottomTabNavigation");
    } else {
      setInitialRoute("InstanceSelectScreen");
    }
  }, []);

  if (initialRoute === undefined) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="InstanceSelectScreen" component={InstanceSelectScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
      <Stack.Screen name="BottomTabNavigation" component={BottomTabsNavigation} />
    </Stack.Navigator>
  );
}
