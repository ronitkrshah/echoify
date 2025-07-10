import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { TStackNavigationRoutes } from "~/navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useLoadingDialog } from "~/core/components";
import { Music } from "~/models";
import { InnertubeApi } from "~/api";
import TrackPlayer from "react-native-track-player";
import { VirtualMusicPlayerService } from "~/core/services";
import { Database } from "~/database";
import { PlaylistEntity, SongEntity } from "~/database/entities";
import { MusicListItem } from "../__shared__/components";
import { usePlayerController } from "~/core/playerController";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchResultsScreen">;

export default function SearchResultsScreen({ route, navigation }: TProps) {
  const [searchResult, setSearchResult] = useState<Music[]>([]);

  const loadingDialog = useLoadingDialog();
  const theme = useTheme();
  const playerController = usePlayerController();

  useEffect(() => {
    InnertubeApi.searchMusicsAsync(route.params.query).then(setSearchResult);
  }, []);

  async function handleSongClickAsync(music: Music) {
    const activeTrack = await TrackPlayer.getActiveTrack();
    if (activeTrack) {
      if (activeTrack.id === music.videoId) {
        // This track is already playing
        playerController.showModal();
        return;
      }
    }

    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("NORMAL");
      await VirtualMusicPlayerService.playMusicAsync(music);
      playerController.showModal();
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  async function handleSongAddToPlaylist(music: Music) {
    try {
      const songRepo = Database.datasource.getRepository(SongEntity);
      const playListRepo = Database.datasource.getRepository(PlaylistEntity);

      // Step 1: Create and save the new song
      const newSong = songRepo.create({
        title: music.title,
        duration: music.duration,
        songId: music.videoId,
        thumbnail: music.thumbnail,
        uploadedBy: music.author,
      });
      const addedSong = await songRepo.save(newSong);

      // Step 2: Load the playlist with its current songs
      const playlist = await playListRepo.findOne({
        where: { id: 1 }, // or whatever ID you want
        relations: ["songs"], // important: load related songs
      });

      if (!playlist) return;

      // Step 3: Add the new song if it's not already in the playlist
      const alreadyExists = playlist.songs.some((song) => song.songId === addedSong.songId);
      if (!alreadyExists) {
        playlist.songs.push(addedSong);
        await playListRepo.save(playlist); // this handles the join table
      }

      ToastAndroid.show("ADDED TO PLAYLIST", ToastAndroid.SHORT);
    } catch (error) {
      console.log("Failed to add song to playlist:", error);
    }
  }

  return (
    <SafeAreaView style={{ paddingHorizontal: 16, gap: 16, flex: 1 }}>
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
          navigation.goBack();
        }}
      >
        <MaterialDesignIcons color={theme.colors.onBackground} name="magnify" size={24} />
        <Text variant="titleMedium">{route.params.query}</Text>
      </Pressable>

      <Animated.FlatList
        data={searchResult.splice(4, searchResult.length - 1)}
        keyExtractor={(item) => item.videoId}
        ListHeaderComponent={() => {
          if (searchResult.length === 0) return null;
          return (
            <View style={{ gap: 16 }}>
              <Animated.View
                entering={FadeIn}
                style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
              >
                <MaterialDesignIcons color={theme.colors.primary} name="music-circle" size={32} />
                <Text
                  variant="headlineMedium"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  Best Match
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeIn.delay(300)}
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  backgroundColor: theme.dark
                    ? theme.colors.elevation.level5
                    : theme.colors.primaryContainer,
                  borderRadius: 32,
                }}
              >
                {searchResult.slice(0, 4).map((it, index) => {
                  return (
                    <Animated.View
                      entering={FadeIn.delay(300 + index * 100)}
                      key={it.videoId}
                      style={{ borderRadius: 32, overflow: "hidden", width: "50%" }}
                    >
                      <Pressable
                        onPress={() => handleSongClickAsync(it)}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 16,
                          gap: 16,
                          flex: 1,
                        }}
                        android_ripple={{
                          color: theme.colors.secondary,
                        }}
                      >
                        <Image
                          source={{ uri: it.thumbnail }}
                          height={70}
                          width={70}
                          resizeMode="cover"
                          style={{ borderRadius: 45 }}
                        />
                        <Text
                          style={{
                            color: theme.colors.primary,
                          }}
                          variant="titleSmall"
                          numberOfLines={1}
                        >
                          {it.title}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </Animated.View>

              <Animated.View
                entering={FadeIn}
                style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
              >
                <MaterialDesignIcons color={theme.colors.primary} name="disc" size={32} />
                <Text
                  variant="headlineMedium"
                  style={{ fontWeight: "bold", color: theme.colors.primary }}
                >
                  Tracks
                </Text>
              </Animated.View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 22 }}
        ListEmptyComponent={<ActivityIndicator />}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              style={{ borderRadius: 32, overflow: "hidden" }}
              entering={FadeInDown.delay(index * 100)}
            >
              <MusicListItem
                music={item}
                onPress={handleSongClickAsync}
                onLongPress={handleSongAddToPlaylist}
              />
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
});
