import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dimensions, Pressable, ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {
  CurrentPlayingMusicOverlay,
  Playlists,
  RecentSongsList,
  TrendingSongsList,
} from "./components";
import { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppUpdateService } from "~/core/services";
import { useAlertDialog } from "~/core/components";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "HomeScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

const _screenWidth = Dimensions.get("screen").width;

export default function HomeScreen({ navigation }: TProps) {
  const theme = useTheme();
  const alertDialog = useAlertDialog();

  useEffect(() => {
    AppUpdateService.getUpdateAsync().then((data) => {
      if (!data) return;
      if (AppUpdateService.isUpdateAvailable(data[0].tag_name)) {
        alertDialog.show({
          title: "Echoify Just Got Better",
          description: "We’ve made some exciting changes. Tap below to grab it.",
          confirmText: "DOWNLOAD",
          onConfirm() {
            ToastAndroid.show("Downloading Update", ToastAndroid.SHORT);
            AppUpdateService.downloadUpdateAndInstallPackageAsync(data[0].assets).catch((e) => {
              ToastAndroid.show((e as Error).message, ToastAndroid.SHORT);
            });
          },
        });
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, gap: 20 }}>
        <Pressable
          style={[
            {
              backgroundColor: theme.dark
                ? theme.colors.elevation.level5
                : theme.colors.primaryContainer,
            },
            styles.searchBar,
          ]}
          onPress={() => {
            navigation.push("SearchScreen");
          }}
        >
          <MaterialDesignIcons name="magnify" size={24} color={theme.colors.onBackground} />
          <Text variant="titleMedium">Search</Text>
        </Pressable>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            gap: 40,
            paddingBottom: 120,
          }}
        >
          <RecentSongsList />

          <TrendingSongsList />

          <Playlists query="Trending Songs" headerTitle="Trending" />
          <Playlists query="Romantic Songs New" headerTitle="Romantic" />
        </ScrollView>
      </View>
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{ position: "absolute", width: _screenWidth, bottom: 0, left: 0 }}
      >
        <CurrentPlayingMusicOverlay />
      </Animated.View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
    marginHorizontal: 16,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
