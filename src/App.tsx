import "reflect-metadata";
import { MaterialYouTheme } from "./theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { useEffect } from "react";
import { InnertubeApi } from "./api";
import { MusicPlayerService } from "./services";
import { StatusBar } from "expo-status-bar";
import { Database } from "./database";

export default function App() {
  useEffect(() => {
    Database.initializeDatabaseConnection();
    MusicPlayerService.setupTrackPlayer();
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
