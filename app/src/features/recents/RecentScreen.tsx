import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
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
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "RecentsScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

const _perPageData = 20;

export default function RecentScreen({ navigation }: TProps) {
  const [recentSongs, setRecentSongs] = useState<SongEntity[]>([]);
  const theme = useTheme();

  const loadingDialog = useLoadingDialog();

  async function handleMusicPressAsync(music: Music) {
    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("NORMAL");
      await VirtualMusicPlayerService.playMusicAsync(music);
      navigation.push("PlayerControllerScreen");
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  async function getRecentsDataAsync(pageNumber = 0) {
    const data = await RecentsRepository.getLimitedMusicsAsync(
      pageNumber * _perPageData,
      _perPageData
    );
    if (data) {
      setRecentSongs((p) => [...p, ...data]);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setRecentSongs([]);
      getRecentsDataAsync();
    });
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
        data={recentSongs}
        onEndReachedThreshold={0.1}
        onEndReached={() => getRecentsDataAsync(recentSongs.length / _perPageData)}
        keyExtractor={(item, index) => `${item.id}_${item.songId}_${index}`}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 16 }}
        renderItem={({ item, index }) => (
          <Animated.View style={{ borderRadius: 32, overflow: "hidden" }} entering={FadeInDown}>
            <MusicListItem
              onPress={handleMusicPressAsync}
              music={Music.convertFromSongEntity(item)}
            />
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
