import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import { TrendingScreen } from "~/features/standalone";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useTheme } from "react-native-paper";

export type TBottomTabRoutes = {
  TrendingScreen: undefined;
  PlayerControllerScreen: undefined;
  HistoryScreen: undefined;
  SettingsScreen: undefined;
};

const TrendingIcon = MaterialDesignIcons.getImageSourceSync("compass-outline", 24)!;
const PlayerIcon = MaterialDesignIcons.getImageSourceSync("disc", 24)!;
const HistoryIcon = MaterialDesignIcons.getImageSourceSync("history", 24)!;
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
        name="TrendingScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "Trending", tabBarIcon: () => TrendingIcon }}
      />
      <Tabs.Screen
        name="PlayerControllerScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "Player", tabBarIcon: () => PlayerIcon }}
      />
      <Tabs.Screen
        name="HistoryScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "History", tabBarIcon: () => HistoryIcon }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "Settings", tabBarIcon: () => SettingsIcon }}
      />
    </Tabs.Navigator>
  );
}
