import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dimensions, StyleSheet, View } from "react-native";
import { InnertubeApi } from "~/api";
import { Database } from "~/database";
import { TStackNavigationRoutes } from "~/navigation";
import { MusicPlayerService } from "~/core/services";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useEffect } from "react";
import { sleepThreadAsync } from "~/core/utils";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SplashScreen">;

const screenWidth = Dimensions.get("screen").width;

export default function SplashScreen({ navigation }: TProps) {
  const theme = useTheme();

  async function bootStrapAsync() {
    MusicPlayerService.setupTrackPlayer();
    const dbConnection = Database.initializeDatabaseConnection();
    const innertube = InnertubeApi.setupInnertube();

    await dbConnection;
    Database.runMigrationsAsync().catch(() => {
      console.log("[DB]: Error Migrating Database");
    });
    await innertube;
    await sleepThreadAsync(300); // Prevent laggy navigation
  }

  useEffect(() => {
    bootStrapAsync().finally(() => {
      navigation.replace("BottomTabNavigation", { screen: "HomeScreen" });
    });
  }, []);

  return (
    <View style={styles.container}>
      <MaterialDesignIcons
        name="music-note-eighth"
        size={screenWidth * 0.6}
        color={theme.colors.primary}
      />
      <Text variant="headlineLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
        Echoify Music
      </Text>
      <ActivityIndicator />
    </View>
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
