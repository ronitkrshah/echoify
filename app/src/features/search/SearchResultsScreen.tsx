import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { TStackNavigationRoutes } from "~/navigation";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useLoadingDialog } from "~/core/components";
import { Music } from "~/models";
import { HostedBackendApi } from "~/api";
import TrackPlayer from "react-native-track-player";
import { VirtualMusicPlayerService } from "~/services";
import { Database } from "~/database";
import { PlaylistEntity, SongEntity } from "~/database/entities";
import { MusicListItem } from "../__shared__/components";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchResultsScreen">;

export default function SearchResultsScreen({ route, navigation }: TProps) {
  const [searchResult, setSearchResult] = useState<Music[]>([]);

  const loadingDialog = useLoadingDialog();
  const theme = useTheme();

  useEffect(() => {
    HostedBackendApi.searchMusicsAsync(route.params.query).then(setSearchResult);
  }, []);

  async function handleSongClickAsync(music: Music) {
    const activeTrack = await TrackPlayer.getActiveTrack();
    if (activeTrack) {
      if (activeTrack.id === music.videoId) {
        navigation.push("PlayerControllerScreen");
        return;
      }
    }

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
        keyExtractor={(item, index) => item.videoId + index}
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
                      key={it.videoId + index}
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
              <MusicListItem music={item} onPress={handleSongClickAsync} />
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
