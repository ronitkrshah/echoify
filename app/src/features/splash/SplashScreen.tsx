import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dimensions, StyleSheet, ToastAndroid, View } from "react-native";
import { Database } from "~/database";
import { TStackNavigationRoutes } from "~/navigation";
import { MusicPlayerService } from "~/core/services";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Text, useTheme } from "react-native-paper";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SplashScreen">;

const screenWidth = Dimensions.get("screen").width;

export default function SplashScreen({ navigation }: TProps) {
  const theme = useTheme();

  async function bootStrapAsync() {
    MusicPlayerService.setupTrackPlayer();
    try {
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
