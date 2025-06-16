import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PipedApi, TSearchPlaylist } from "~/api";
import { asyncFuncExecutor } from "~/utils";
import Animated, { FadeIn } from "react-native-reanimated";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "TrendingScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

type TTredingVideosEnum = "Trending" | "Romantic";
const _trendingSectionIcons = {
  Trending: "compass",
  Romantic: "heart-multiple",
} as const;

export default function TrendingScreen({ navigation }: TProps) {
  const [trendingVideos, setTrendingVideos] = useState<
    Record<TTredingVideosEnum, TSearchPlaylist[]>
  >({
    Trending: [],
    Romantic: [],
  });
  const theme = useTheme();

  async function bootStrapAsync() {
    const [trendingResult, romanticResult] = await Promise.all([
      asyncFuncExecutor(() =>
        PipedApi.searchWithQueryAsync<TSearchPlaylist[]>("2025 Trending Music India", "playlists")
      ),
      asyncFuncExecutor(() =>
        PipedApi.searchWithQueryAsync<TSearchPlaylist[]>("Romantic Music India", "playlists")
      ),
    ]);

    const [trending] = trendingResult;
    const [romantic] = romanticResult;

    setTrendingVideos({
      Trending: trending ?? [],
      Romantic: romantic ?? [],
    });
  }

  useEffect(() => {
    bootStrapAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={[{ backgroundColor: theme.colors.elevation.level5 }, styles.searchBar]}
        onPress={() => {
          navigation.push("SearchScreen");
        }}
      >
        <MaterialDesignIcons name="magnify" size={24} />
        <Text variant="titleMedium">Search Songs...</Text>
      </Pressable>
      <ScrollView
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 30 }}
      >
        {Object.entries(trendingVideos).map(([key, value], entryIndex) => {
          if (value.length === 0) return null;
          return (
            <View key={key} style={{ gap: 16 }}>
              <Animated.View
                entering={FadeIn}
                style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              >
                <MaterialDesignIcons
                  name={_trendingSectionIcons[key as keyof typeof _trendingSectionIcons]}
                  size={40}
                  color={theme.colors.primary}
                />
                <Text
                  variant="titleLarge"
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  {key}
                </Text>
              </Animated.View>

              <FlatList
                horizontal
                data={value}
                keyExtractor={(item) => item.url}
                contentContainerStyle={{ gap: 16 }}
                renderItem={({ item, index }) => {
                  return (
                    <Animated.View
                      style={{ borderRadius: 16, overflow: "hidden" }}
                      entering={FadeIn.delay(index * 150 * entryIndex)}
                    >
                      <Pressable
                        android_ripple={{ color: theme.colors.primary }}
                        style={{
                          width: 140,
                          gap: 12,
                          paddingHorizontal: 8,
                          paddingVertical: 16,
                        }}
                      >
                        <View
                          style={{
                            width: 120,
                            aspectRatio: 1,
                            overflow: "hidden",
                            borderRadius: 20,
                            marginHorizontal: "auto",
                          }}
                        >
                          <Image
                            source={{ uri: item.thumbnail }}
                            style={StyleSheet.absoluteFillObject}
                          />
                        </View>
                        <Text
                          numberOfLines={2}
                          variant="labelLarge"
                          style={{ textAlign: "center", height: "auto" }}
                        >
                          {item.name}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  );
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
  playlistCard: {
    width: 150,
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
});
