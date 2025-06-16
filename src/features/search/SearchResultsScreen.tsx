import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { PipedApi, TSearchVideo } from "~/api";
import { TStackNavigationRoutes } from "~/navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchResultsScreen">;

export default function SearchResultsScreen({ route, navigation }: TProps) {
  const [searchResult, setSearchResult] = useState<TSearchVideo[]>([]);
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

  async function handleSongClickAsync(url: string) {}

  return (
    <View style={{ paddingHorizontal: 16, gap: 16 }}>
      <Pressable
        style={[{ backgroundColor: theme.colors.elevation.level5 }, styles.searchBar]}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <MaterialDesignIcons name="magnify" size={24} />
        <Text variant="titleMedium">{route.params.query}</Text>
      </Pressable>
      <FlatList
        ListEmptyComponent={<ActivityIndicator size={"large"} />}
        style={{ backgroundColor: theme.colors.background }}
        data={searchResult}
        keyExtractor={(item) => item.url}
        contentContainerStyle={{ gap: 24 }}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              style={{ borderRadius: 40, overflow: "hidden" }}
              entering={FadeInDown.delay(index * 100).duration(600)}
            >
              <Pressable
                onPress={() => handleSongClickAsync(item.url.split("=").pop()!)}
                style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
                android_ripple={{ color: theme.colors.primary }}
              >
                <Image source={{ uri: item.thumbnail }} style={styles.songThumbnail} />
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text numberOfLines={2}>{item.title}</Text>
                  <Text style={{ color: theme.colors.primary }}>
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
  songThumbnail: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 40,
  },
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
});
