import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigation, { TBottomTabRoutes } from "./BottomTabNavigation";
import { SearchResultsScreen, SearchScreen } from "~/features/search";
import { useTheme } from "react-native-paper";
import { PlaylistDetailsScreen } from "~/features/playlist";
import { PlayerControllerScreen } from "~/features/player";

export type TStackNavigationRoutes = {
  InstanceSelectScreen: undefined;
  BottomTabNavigation: NavigatorScreenParams<TBottomTabRoutes>;

  PlaylistDetailsScreen: { playlistId: number };

  PlayerControllerScreen: undefined;

  SearchScreen: undefined;
  SearchResultsScreen: { query: string };
};

const Stack = createNativeStackNavigator<TStackNavigationRoutes>();

export default function StackNavigation() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="BottomTabNavigation" component={BottomTabsNavigation} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
      <Stack.Screen name="PlaylistDetailsScreen" component={PlaylistDetailsScreen} />
      <Stack.Screen name="PlayerControllerScreen" component={PlayerControllerScreen} />
    </Stack.Navigator>
  );
}
