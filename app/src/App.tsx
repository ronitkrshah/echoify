import "reflect-metadata";
import { MaterialYouTheme } from "./core/theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <SafeAreaProvider>
      <MaterialYouTheme>
        <LoadingDialogProvider>
          <AlertDialogProvider>
            <AppNavigation />
          </AlertDialogProvider>
        </LoadingDialogProvider>
      </MaterialYouTheme>
    </SafeAreaProvider>
  );
}
