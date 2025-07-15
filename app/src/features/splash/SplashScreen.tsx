import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dimensions, StyleSheet, ToastAndroid, View } from "react-native";
import { Database } from "~/database";
import { TStackNavigationRoutes } from "~/navigation";
import { DefaultStreamingService, InnertubeStreamingService, MusicPlayerService } from "~/services";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Text, useTheme } from "react-native-paper";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocalStorage } from "~/core/utils";
import { AbstractStreamingService } from "~/abstracts";
import SessionStorage from "~/core/utils/SessionStorage";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SplashScreen">;

const screenWidth = Dimensions.get("screen").width;

export default function SplashScreen({ navigation }: TProps) {
  const theme = useTheme();

  async function bootStrapAsync() {
    MusicPlayerService.setupTrackPlayer();
    try {
      const streamingService = LocalStorage.getItem(AbstractStreamingService.name);

      if (!streamingService || streamingService === DefaultStreamingService.NAME) {
        SessionStorage.set(AbstractStreamingService.name, DefaultStreamingService);
        await DefaultStreamingService.setup();
      } else {
        SessionStorage.set(AbstractStreamingService.name, InnertubeStreamingService);
        await InnertubeStreamingService.setup();
      }

      await Database.initializeDatabaseConnection();
      await Database.runMigrationsAsync();
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    bootStrapAsync().finally(() => {
      navigation.replace("BottomTabNavigation", { screen: "HomeScreen" });
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MaterialDesignIcons
        name="music-note-eighth"
        size={screenWidth * 0.6}
        color={theme.colors.primary}
      />
      <Text variant="headlineLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
        Echoify Music
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
