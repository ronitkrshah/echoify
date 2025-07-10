import * as Media from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { Music } from "~/models";
import * as Device from "expo-device";
import { Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MusicListItem } from "../__shared__/components";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "OfflineSongsScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function OfflineScreen({ navigation }: TProps) {
  const [storedMusics, setStoredMusics] = useState<Music[]>([]);

  const theme = useTheme();

  async function askForPermissionAsync() {
    const status = await Media.requestPermissionsAsync(false, ["audio"]);
    if (status.granted) {
      return true;
    } else {
      ToastAndroid.show("Permission Denied!", ToastAndroid.SHORT);
      return false;
    }
  }

  async function getLocalMusicsAsync() {
    const musics = await Media.getAssetsAsync({ mediaType: "audio", sortBy: "default" });

    const t = musics.assets.map(
      (it) =>
        new Music(it.id, it.filename, Device.deviceName ?? "System", it.duration, "ic_launcher")
    );
    setStoredMusics(t);
  }

  async function bootStrapAsync() {
    const isPermissionGranted = await askForPermissionAsync();
    if (!isPermissionGranted) return;
    getLocalMusicsAsync();
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", bootStrapAsync);
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}>
          Recents
        </Text>
      </View>
      <FlatList
        data={storedMusics}
        onEndReachedThreshold={0.1}
        // onEndReached={() => getRecentsDataAsync(recentSongs.length / _perPageData)}
        keyExtractor={(item) => item.videoId}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 16 }}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{ borderRadius: 32, overflow: "hidden" }}
            entering={FadeInDown.delay(index * 100)}
          >
            <MusicListItem
              // onPress={handleMusicPressAsync}
              music={item}
            />
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
