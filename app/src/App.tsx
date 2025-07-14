import "reflect-metadata";
import { MaterialYouTheme } from "./core/theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlayerControllerProvider } from "./core/playerController";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
