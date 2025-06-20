import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SongEntity } from "~/database/entities";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import RecentsRepository from "~/repositories/RecentsRepository";
import { MusicListItem } from "../__shared__/components";
import { Music } from "~/models";
import { Text, useTheme } from "react-native-paper";
import { useLoadingDialog } from "~/core/components";
import { VirtualMusicPlayerService } from "~/services";
import { asyncFuncExecutor } from "~/utils";
import TrackPlayer from "react-native-track-player";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "RecentsScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function RecentScreen({ navigation }: TProps) {
  const [recentSongs, setRecentSongs] = useState<SongEntity[]>([]);
  const theme = useTheme();

  const loadingDialog = useLoadingDialog();

  async function handleMusicPressAsync(music: Music) {
    loadingDialog.show("Fetching Streams");
    await VirtualMusicPlayerService.resetAsync();
    VirtualMusicPlayerService.setQueueType("PLAYLIST");
    VirtualMusicPlayerService.addMusicsToQueue(
      recentSongs.map((it) => Music.convertFromSongEntity(it))
    );
    const [track] = await asyncFuncExecutor(() =>
      VirtualMusicPlayerService.getRNTPTrackFromMusicAsync(music)
    );
    navigation.push("PlayerControllerScreen");
    loadingDialog.dismiss();
    if (track) {
      await TrackPlayer.add([track]);
      TrackPlayer.play();
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      RecentsRepository.getAllMusicsAsync().then((data) => {
        setRecentSongs(data ?? []);
      });
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}>
          Recents
        </Text>
      </View>
      <FlatList
        data={recentSongs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 16 }}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{ borderRadius: 32, overflow: "hidden" }}
            entering={FadeInDown.delay(index * 100)}
          >
            <MusicListItem
              onPress={handleMusicPressAsync}
              music={Music.convertFromSongEntity(item)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
}
