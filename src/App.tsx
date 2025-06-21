import "reflect-metadata";
import { MaterialYouTheme } from "./core/theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar animated style="auto" />
      <MaterialYouTheme>
        <LoadingDialogProvider>
          <AlertDialogProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <AppNavigation />
            </SafeAreaView>
          </AlertDialogProvider>
        </LoadingDialogProvider>
      </MaterialYouTheme>
    </SafeAreaProvider>
  );
}
