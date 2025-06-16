import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useTheme } from "react-native-paper";
import { HistoryScreen } from "~/features/history";
import { HomeScreen } from "~/features/home";
import { PlaylistScreen } from "~/features/playlist";

export type TBottomTabRoutes = {
  HomeScreen: undefined;
  PlayerControllerScreen: undefined;
  HistoryScreen: undefined;
  PlaylistsScreen: undefined;
  SettingsScreen: undefined;
};

const TrendingIcon = MaterialDesignIcons.getImageSourceSync("compass-outline", 24)!;
const HistoryIcon = MaterialDesignIcons.getImageSourceSync("history", 24)!;
const PlayerIcon = MaterialDesignIcons.getImageSourceSync("disc", 24)!;
const PlaylistsIcon = MaterialDesignIcons.getImageSourceSync("playlist-music", 24)!;
const SettingsIcon = MaterialDesignIcons.getImageSourceSync("cog", 24)!;

const Tabs = createNativeBottomTabNavigator<TBottomTabRoutes>();

export default function BottomTabsNavigation() {
  const theme = useTheme();
  return (
    <Tabs.Navigator
      tabBarInactiveTintColor={theme.colors.scrim}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ tabBarLabel: "Trending", tabBarIcon: () => TrendingIcon }}
      />
      <Tabs.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ tabBarLabel: "History", tabBarIcon: () => HistoryIcon }}
      />
      <Tabs.Screen
        name="PlayerControllerScreen"
        component={HomeScreen}
        options={{ tabBarLabel: "Player", tabBarIcon: () => PlayerIcon }}
      />
      <Tabs.Screen
        name="PlaylistsScreen"
        component={PlaylistScreen}
        options={{ tabBarLabel: "Playlists", tabBarIcon: () => PlaylistsIcon }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        component={HomeScreen}
        options={{ tabBarLabel: "Settings", tabBarIcon: () => SettingsIcon }}
      />
    </Tabs.Navigator>
  );
}
