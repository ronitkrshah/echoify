import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import TrackPlayer from "react-native-track-player";
import { InnertubeApi } from "~/api";
import { useLoadingDialog } from "~/core/components";
import { Music } from "~/models";
import { TStackNavigationRoutes } from "~/navigation";
import { VirtualMusicPlayerService } from "~/services";
import { asyncFuncExecutor } from "~/utils";
import { MusicListItem } from "../__shared__/components";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "YoutubePlaylistDetailsScreen">;

export default function YoutubePlaylistDetailsScreen({ navigation, route }: TProps) {
  const [playlistDetails, setPlaylistDetails] =
    useState<Awaited<ReturnType<typeof InnertubeApi.getPlaylistDetialsAsync>>>();
  const theme = useTheme();
  const loadingDialog = useLoadingDialog();

  async function handleMusicPressAsync(music: Music) {
    if (!playlistDetails) {
      ToastAndroid.show("List Unavailable", ToastAndroid.SHORT);
      return;
    }
    loadingDialog.show("Fetching Streams");
    await VirtualMusicPlayerService.resetAsync();
    VirtualMusicPlayerService.setQueueType("PLAYLIST");
    VirtualMusicPlayerService.addMusicsToQueue(playlistDetails.videos);
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
    InnertubeApi.getPlaylistDetialsAsync(route.params.playlistId).then(setPlaylistDetails);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={[styles.rootContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <View style={styles.playlistDetails}>
              <View>
                <Text
                  variant="headlineLarge"
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  {playlistDetails?.title}
                </Text>
                <Text variant="titleMedium">{playlistDetails?.videos.length} Songs</Text>
              </View>
            </View>
          </View>
        )}
        data={playlistDetails?.videos}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              style={{ borderRadius: 32, overflow: "hidden", paddingHorizontal: 8 }}
              entering={FadeInDown.delay(index * 100)}
            >
              <MusicListItem music={item} onPress={handleMusicPressAsync} />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
    elevation: 4,
    padding: 30,
    height: Dimensions.get("screen").height * 0.45,
  },
  playlistDetails: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
