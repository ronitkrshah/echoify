import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, ToastAndroid, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { InnertubeApi } from "~/api";
import { useLoadingDialog } from "~/core/components";
import { Music } from "~/models";
import { TStackNavigationRoutes } from "~/navigation";
import { VirtualMusicPlayerService } from "~/core/services";
import { MusicListItem } from "../__shared__/components";
import { usePlayerController } from "~/core/playerController";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "YoutubePlaylistDetailsScreen">;

export default function YoutubePlaylistDetailsScreen({ navigation, route }: TProps) {
  const [playlistDetails, setPlaylistDetails] =
    useState<Awaited<ReturnType<typeof InnertubeApi.getPlaylistDetialsAsync>>>();
  const theme = useTheme();
  const loadingDialog = useLoadingDialog();
  const playerController = usePlayerController();

  async function handleMusicPressAsync(music: Music) {
    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("PLAYLIST");
      await VirtualMusicPlayerService.playMusicAsync(music, playlistDetails?.videos);
      playerController.showModal();
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  useEffect(() => {
    InnertubeApi.getPlaylistDetialsAsync(route.params.playlistId).then(setPlaylistDetails);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
    </SafeAreaView>
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
