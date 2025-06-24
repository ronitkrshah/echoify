import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useTheme } from "react-native-paper";
import { HomeScreen } from "~/features/home";
import { PlaylistScreen } from "~/features/playlist";
import { RecentScreen } from "~/features/recents";

export type TBottomTabRoutes = {
  HomeScreen: undefined;
  RecentsScreen: undefined;
  PlaylistsScreen: undefined;
  SettingsScreen: undefined;
};

const TrendingIcon = MaterialDesignIcons.getImageSourceSync("compass-outline", 24)!;
const RecentsIcon = MaterialDesignIcons.getImageSourceSync("history", 24)!;
const PlaylistsIcon = MaterialDesignIcons.getImageSourceSync("playlist-music", 24)!;
const SettingsIcon = MaterialDesignIcons.getImageSourceSync("cog", 24)!;

const Tabs = createNativeBottomTabNavigator<TBottomTabRoutes>();

export default function BottomTabsNavigation() {
  const theme = useTheme();
  return (
    <Tabs.Navigator
      tabBarInactiveTintColor={theme.colors.onPrimaryContainer}
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
        name="RecentsScreen"
        component={RecentScreen}
        options={{ tabBarLabel: "Recents", tabBarIcon: () => RecentsIcon }}
      />
      <Tabs.Screen
        name="PlaylistsScreen"
        component={PlaylistScreen}
        options={{ tabBarLabel: "Playlists", tabBarIcon: () => PlaylistsIcon }}
      />
      {/* <Tabs.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ tabBarLabel: "Settings", tabBarIcon: () => SettingsIcon }}
      /> */}
    </Tabs.Navigator>
  );
}
