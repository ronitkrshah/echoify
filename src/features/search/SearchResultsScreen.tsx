import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { PipedApi, TSearchVideo } from "~/api";
import { TStackNavigationRoutes } from "~/navigation";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchResultsScreen">;

export default function SearchResultsScreen({ route }: TProps) {
  const [searchResult, setSearchResult] = useState<TSearchVideo[]>([]);
  const theme = useTheme();

  useEffect(() => {
    PipedApi.searchVideosAsync(route.params.query).then(setSearchResult).catch(console.log);
  }, []);

  function formatDuration(seconds: number) {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    const secs = duration.seconds();
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  async function handleSongClickAsync(url: string) {
    const music = await PipedApi.getVideoStreamingInfoAsync(url);
    const streams = music.audioStreams;

    const filteredStreams = streams.filter((it) => it.format === "M4A");
    const tempPlay = filteredStreams[1];

    try {
      await TrackPlayer.add([
        {
          url: tempPlay.url, // Load media from the app bundle
          title: music.title,
          artist: music.uploader,
          artwork: music.thumbnailUrl, // Load artwork from the app bundle
          duration: music.duration,
        },
      ]);

      TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FlatList
      style={{ backgroundColor: theme.colors.background }}
      data={searchResult}
      keyExtractor={(item) => item.url}
      contentContainerStyle={{ gap: 24, paddingHorizontal: 16 }}
      renderItem={({ item }) => {
        return (
          <View style={{ borderRadius: 20, overflow: "hidden" }}>
            <Pressable
              onPress={() => handleSongClickAsync(item.url.split("=").pop()!)}
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              android_ripple={{ color: theme.colors.primary }}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.songThumbnail} />
              <View>
                <Text numberOfLines={2}>{item.title}</Text>
                <Text>{formatDuration(item.duration)}</Text>
              </View>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  songThumbnail: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 40,
  },
});
