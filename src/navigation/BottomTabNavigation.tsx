import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import { TrendingScreen } from "~/features/standalone";

export type TBottomTabRoutes = {
  TrendingScreen: undefined;
  HistoryScreen: undefined;
  SettingsScreen: undefined;
};

const Tabs = createNativeBottomTabNavigator<TBottomTabRoutes>();

export default function BottomTabsNavigation() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="TrendingScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "Trending" }}
      />
      <Tabs.Screen
        name="HistoryScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "History" }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        component={TrendingScreen}
        options={{ tabBarLabel: "Settings" }}
      />
    </Tabs.Navigator>
  );
}
