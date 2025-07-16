import "reflect-metadata";
import { MaterialYouTheme } from "./core/theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerControllerProvider } from "./core/playerController";

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <MaterialYouTheme>
          <PlayerControllerProvider>
            <LoadingDialogProvider>
              <AlertDialogProvider>
                <AppNavigation />
              </AlertDialogProvider>
            </LoadingDialogProvider>
          </PlayerControllerProvider>
        </MaterialYouTheme>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
