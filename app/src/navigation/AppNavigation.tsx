import { useTheme } from "react-native-paper";
import * as SystemUI from "expo-system-ui";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./StackNavigation";
import { useEffect } from "react";
import { StatusBar } from "react-native";

export default function AppNavigation() {
  const theme = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
    StatusBar.setBackgroundColor(theme.colors.surface);
    StatusBar.setBarStyle(theme.dark ? "light-content" : "dark-content");
  }, []);

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}
