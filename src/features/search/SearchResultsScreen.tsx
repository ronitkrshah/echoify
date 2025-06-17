import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import TrackPlayer, { Track } from "react-native-track-player";
import { PipedApi, TSearchVideo, TVideoStreamResult } from "~/api";
import { TStackNavigationRoutes } from "~/navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { MusicPlayerService } from "~/services";
import { useLoadingDialog } from "~/core/components";
import { asyncFuncExecutor, sleepThreadAsync } from "~/utils";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchResultsScreen">;

export default function SearchResultsScreen({ route, navigation }: TProps) {
  const [searchResult, setSearchResult] = useState<TSearchVideo[]>([]);

  const loadingDialog = useLoadingDialog();
  const theme = useTheme();

  useEffect(() => {
    PipedApi.searchWithQueryAsync<TSearchVideo[]>(route.params.query, "music_videos")
      .then(setSearchResult)
      .catch(console.log);
  }, []);

  function formatDuration(seconds: number) {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    const secs = duration.seconds();
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  async function handleSongClickAsync(song: TSearchVideo) {
    loadingDialog.show("Fetching Streams...");
    const [streamingInfo] = await asyncFuncExecutor(() =>
      PipedApi.getVideoStreamingInfoAsync(song.url)
    );

    if (!streamingInfo) {
      loadingDialog.dismiss();
      ToastAndroid.show("Something Went Wrong", ToastAndroid.SHORT);
      return;
    }

    /** If threre's no audio streams. Then might be an error */
    if (!Object.hasOwn(streamingInfo, "audioStreams")) {
      loadingDialog.dismiss();
      ToastAndroid.show(
        (streamingInfo as any as Error).message || JSON.stringify(streamingInfo),
        ToastAndroid.SHORT
      );
      return;
    }

    await TrackPlayer.reset();
    let itag = 0;
    let audioTrackStream: TVideoStreamResult["audioStreams"][number] | undefined;
    const m4aStreams = streamingInfo.audioStreams.filter((it) => it.format === "M4A");
    m4aStreams.forEach((it) => {
      if (it.itag > itag) {
        itag = it.itag;
        audioTrackStream = it;
      }
    });
    if (audioTrackStream) {
      await TrackPlayer.add([
        {
          url: audioTrackStream?.url, // Load media from the network
          title: streamingInfo.title,
          artist: streamingInfo.uploader,
          genre: streamingInfo.category,
          artwork: streamingInfo.thumbnailUrl, // Load artwork from the network
          duration: streamingInfo.duration,
        },
      ]);

      await TrackPlayer.play();
      navigation.push("PlayerControllerScreen");
    } else {
      ToastAndroid.show("No M4A Streams Found", ToastAndroid.SHORT);
    }

    loadingDialog.dismiss();
  }

  return (
    <View style={{ paddingHorizontal: 16, gap: 16, flex: 1 }}>
      <Pressable
        style={[{ backgroundColor: theme.colors.elevation.level5 }, styles.searchBar]}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <MaterialDesignIcons name="magnify" size={24} />
        <Text variant="titleMedium">{route.params.query}</Text>
      </Pressable>

      <Animated.FlatList
        data={searchResult.splice(4, searchResult.length - 1)}
        keyExtractor={(item) => item.url}
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
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: 32,
                }}
              >
                {searchResult.slice(0, 4).map((it, index) => {
                  return (
                    <Animated.View
                      entering={FadeIn.delay(300 + index * 100)}
                      key={it.url}
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
                        android_ripple={{ color: theme.colors.secondary }}
                      >
                        <Image
                          source={{ uri: it.thumbnail }}
                          height={70}
                          width={70}
                          resizeMode="cover"
                          style={{ borderRadius: 45 }}
                        />
                        <View style={{ width: "100%" }}>
                          <Text
                            variant="titleSmall"
                            numberOfLines={1}
                            style={{ textAlign: "center" }}
                          >
                            {it.title}
                          </Text>
                        </View>
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
              style={{ borderRadius: 22, overflow: "hidden" }}
              entering={FadeInDown.delay(index * 100)}
            >
              <Pressable
                onPress={() => handleSongClickAsync(item)}
                android_ripple={{ color: theme.colors.primary }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 22,
                  padding: 6,
                }}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  height={60}
                  width={60}
                  style={{ borderRadius: 30 }}
                />
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Text numberOfLines={2}>{item.title}</Text>
                    <Text
                      style={{ fontStyle: "italic", color: theme.colors.secondary }}
                      variant="labelLarge"
                    >
                      {item.uploaderName}
                    </Text>
                  </View>
                  <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        }}
      />
    </View>
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
