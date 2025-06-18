import "reflect-metadata";
import { MaterialYouTheme } from "./theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlertDialogProvider, LoadingDialogProvider } from "./core/components";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Database } from "./database";
import { MusicPlayerService } from "./services";
import TrackPlayer, { Event, State } from "react-native-track-player";
import { Music } from "./models";
import { InnertubeApi } from "./api";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

MusicPlayerService.setupTrackPlayer();
Database.initializeDatabaseConnection().then(() => {
  SplashScreen.hideAsync();
});

export default function App() {
  useEffect(() => {
    const queueEndedSubscription = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async (event) => {
        const activeTrack = event.track;
        if (activeTrack) {
          const nextTrack = await InnertubeApi.getNextVideoAsync(activeTrack.id);
          if (nextTrack) await MusicPlayerService.addMusicToQueueAsync(nextTrack);
        }
      }
    );

    return () => {
      queueEndedSubscription.remove();
    };
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
