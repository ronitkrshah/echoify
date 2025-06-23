import "reflect-metadata";
import { MaterialYouTheme } from "./core/theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
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
    </QueryClientProvider>
  );
}
