import { useTheme } from "react-native-paper";
import * as SystemUI from "expo-system-ui";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./StackNavigation";

export default function AppNavigation() {
  const theme = useTheme();

  SystemUI.setBackgroundColorAsync(theme.colors.background);

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}
