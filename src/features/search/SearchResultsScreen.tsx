import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { PipedApi, TSearchVideo } from "~/api";
import { TStackNavigationRoutes } from "~/navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

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
