import { NativeBottomTabNavigationProp } from "@bottom-tabs/react-navigation";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { SkeletonLoader, useLoadingDialog } from "~/core/components";
import { VirtualMusicPlayerService } from "~/core/services";
import { asyncFuncExecutor } from "~/core/utils";
import { MusicListItem } from "~/features/__shared__/components";
import { Music } from "~/models";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import RecentsRepository from "~/repositories/RecentsRepository";

type Navigation = CompositeNavigationProp<
  NativeBottomTabNavigationProp<TBottomTabRoutes, "HomeScreen">,
  NativeStackNavigationProp<TStackNavigationRoutes>
>;

export default function RecentSongsList() {
  const recentMusics = useQuery({
    queryKey: ["recents"],
    queryFn: async () => {
      return (await RecentsRepository.getLimitedMusicsAsync(0, 3)) ?? [];
    },
  });
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();
  const loadingDialog = useLoadingDialog();

  async function handleMusicPressAsync(music: Music) {
    loadingDialog.show("Fetching Streams");
    await VirtualMusicPlayerService.resetAsync();
    VirtualMusicPlayerService.setQueueType("PLAYLIST");

    const firstFewRecents = await RecentsRepository.getLimitedMusicsAsync(0, 20);

    VirtualMusicPlayerService.addMusicsToQueue(
      firstFewRecents!.map((it) => Music.convertFromSongEntity(it))
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

  return (
    <View style={{ gap: 16 }}>
      {recentMusics.data && recentMusics.data.length > 0 && (
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
          Recents
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 30 }}
      >
        {recentMusics.isFetching && (
          <Fragment>
            <SkeletonLoader
              height={70}
              width={300}
              cornerRadius={40}
              colors={["transparent", theme.colors.inversePrimary, "transparent"]}
              primaryBackground={theme.colors.secondaryContainer}
            />
            <SkeletonLoader
              height={70}
              width={300}
              cornerRadius={40}
              colors={["transparent", theme.colors.inversePrimary, "transparent"]}
              primaryBackground={theme.colors.secondaryContainer}
            />
          </Fragment>
        )}

        {recentMusics.data?.map((it, index) => {
          return (
            <View
              key={it.id.toString()}
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 40,
                overflow: "hidden",
                flexWrap: "wrap",
                width: 300,
              }}
            >
              <MusicListItem
                onPress={handleMusicPressAsync}
                music={Music.convertFromSongEntity(it)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
