import "reflect-metadata";
import { MaterialYouTheme } from "./theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Database } from "./database";
import { MusicPlayerService } from "./services";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

export default function App() {
  async function bootStrapAsync() {
    await MusicPlayerService.setupTrackPlayer();
    await Database.initializeDatabaseConnection();
  }

  useEffect(() => {
    bootStrapAsync().finally(() => {
      SplashScreen.hideAsync()
    });
  }, []);

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
