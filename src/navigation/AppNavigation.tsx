import { useTheme } from "react-native-paper";
import * as SystemUI from "expo-system-ui";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./StackNavigation";
import { Fragment, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

export default function AppNavigation() {
  const theme = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, []);

  return (
    <Fragment>
      <StatusBar animated style={theme.dark ? "light" : "dark"} />
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </Fragment>
  );
}
