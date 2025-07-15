import * as Media from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { Music } from "~/models";
import * as Device from "expo-device";
import { ActivityIndicator, Searchbar, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MusicListItem } from "../__shared__/components";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { VirtualMusicPlayerService } from "~/services";
import { usePlayerController } from "~/core/playerController";
import * as Sharing from "expo-sharing";
import { useDebounce } from "~/hooks";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "OfflineSongsScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

const _holdOptions = [
  {
    title: "Share",
    icon: "share-variant",
    async onPress(music: Music) {
      if (!(await Sharing.isAvailableAsync())) return;
      Sharing.shareAsync(music.streamingLink!);
    },
  },
];

export default function OfflineScreen({ navigation }: TProps) {
  const [storedMusics, setStoredMusics] = useState<Music[]>([]);
  const [seach, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const debouncedSearch = useDebounce(seach, 400);

  const theme = useTheme();
  const playerController = usePlayerController();

  async function askForPermissionAsync() {
    const status = await Media.requestPermissionsAsync(false, ["audio"]);
    if (status.granted) {
      return true;
    } else {
      ToastAndroid.show("Permission Denied!", ToastAndroid.SHORT);
      return false;
    }
  }

  async function getLocalMusicsAsync(endCursor: undefined | string = undefined) {
    const musics = await Media.getAssetsAsync({
      mediaType: "audio",
      sortBy: "default",
      first: 25,
      after: endCursor,
    });
    return musics.assets.map(
      (it) =>
        new Music(
          it.id,
          it.filename,
          Device.deviceName ?? "System",
          it.duration,
          "ic_launcher",
          it.uri
        )
    );
  }

  async function handleMusicPressAsync(music: Music) {
    try {
      VirtualMusicPlayerService.setQueueType("PLAYLIST");
      await VirtualMusicPlayerService.playMusicAsync(music, storedMusics);
      const allmusics = await getAllStoredMusicsAsync();

      VirtualMusicPlayerService.addMusicsToQueue(
        allmusics.map(
          (it) =>
            new Music(
              it.id,
              it.filename,
              Device.deviceName ?? "System",
              it.duration,
              "ic_launcher",
              it.uri
            )
        )
      );
      playerController.showModal();
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    }
  }

  async function getAllStoredMusicsAsync() {
    const musics = await Media.getAssetsAsync({
      mediaType: "audio",
      sortBy: "default",
      first: 25,
    });

    return (
      await Media.getAssetsAsync({
        mediaType: "audio",
        sortBy: "default",
        first: musics.totalCount,
      })
    ).assets;
  }

  async function bootStrapAsync() {
    const isPermissionGranted = await askForPermissionAsync();
    if (!isPermissionGranted) return;
    getLocalMusicsAsync().then(setStoredMusics);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", bootStrapAsync);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (debouncedSearch === "") {
      bootStrapAsync();
    } else {
      getAllStoredMusicsAsync().then((data) => {
        const filteredData = data.filter((it) =>
          it.filename
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(debouncedSearch.toLowerCase().replaceAll(" ", ""))
        );
        setStoredMusics(
          filteredData.map(
            (it) =>
              new Music(
                it.id,
                it.filename,
                Device.deviceName ?? "System",
                it.duration,
                "ic_launcher",
                it.uri
              )
          )
        );
      });
    }
  }, [debouncedSearch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Searchbar
        value={seach}
        onChangeText={setSearch}
        style={{ marginHorizontal: 16 }}
        placeholder="Search Songs"
      />
      <View style={{ padding: 16 }}>
        <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}>
          On Device
        </Text>
      </View>
      <FlatList
        data={storedMusics}
        onEndReachedThreshold={0.2}
        keyExtractor={(item) => item.videoId}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 16 }}
        ListFooterComponent={<ActivityIndicator animating={isFetching} />}
        onEndReached={async () => {
          if (storedMusics.length > 0 && seach === "") {
            setIsFetching(true);
            const music = await getLocalMusicsAsync(storedMusics.length.toString());
            setStoredMusics((p) => [...p, ...music]);
            setIsFetching(false);
          }
        }}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{ borderRadius: 32, overflow: "hidden" }}
            entering={FadeInDown.delay(index * 100)}
          >
            <MusicListItem
              holdOptions={_holdOptions}
              onPress={handleMusicPressAsync}
              music={item}
            />
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
