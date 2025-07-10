import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useTheme } from "react-native-paper";
import { HomeScreen } from "~/features/home";
import { PlaylistScreen } from "~/features/playlist";
import { RecentScreen } from "~/features/recents";
import { DownloadScreen } from "~/features/download";
import { OfflineScreen } from "~/features/offline";

export type TBottomTabRoutes = {
  HomeScreen: undefined;
  RecentsScreen: undefined;
  PlaylistsScreen: undefined;
  OfflineSongsScreen: undefined;
  DownloadsScreen: undefined;
};

const TrendingIcon = MaterialDesignIcons.getImageSourceSync("compass-outline", 24)!;
const RecentsIcon = MaterialDesignIcons.getImageSourceSync("history", 24)!;
const PlaylistsIcon = MaterialDesignIcons.getImageSourceSync("playlist-music", 24)!;
const OfflineSongsIcon = MaterialDesignIcons.getImageSourceSync("disc-player", 24)!;
const DownloadsIcon = MaterialDesignIcons.getImageSourceSync("download", 24)!;

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
      <Tabs.Screen
        name="OfflineSongsScreen"
        component={OfflineScreen}
        options={{ tabBarLabel: "Offline", tabBarIcon: () => OfflineSongsIcon }}
      />
      <Tabs.Screen
        name="DownloadsScreen"
        component={DownloadScreen}
        options={{ tabBarLabel: "Downloads", tabBarIcon: () => DownloadsIcon }}
      />
    </Tabs.Navigator>
  );
}
