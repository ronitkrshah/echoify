import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { FlatList, ScrollView, ToastAndroid, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { InnertubeApi } from "~/api";
import { SkeletonLoader, useLoadingDialog } from "~/core/components";
import { MusicListItem } from "~/features/__shared__/components";
import { Music } from "~/models";
import { VirtualMusicPlayerService } from "~/core/services";
import { asyncFuncExecutor } from "~/core/utils";
import { NativeBottomTabNavigationProp } from "@bottom-tabs/react-navigation";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TrackPlayer from "react-native-track-player";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";

type Navigation = CompositeNavigationProp<
  NativeBottomTabNavigationProp<TBottomTabRoutes, "HomeScreen">,
  NativeStackNavigationProp<TStackNavigationRoutes>
>;

export default function TrendingSongsList() {
  const newSongs = useQuery({
    queryKey: ["new_songs"],
    queryFn: () => InnertubeApi.searchMusicsAsync("New Hindi Songs"),
  });
  const loadingDialog = useLoadingDialog();
  const navigation = useNavigation<Navigation>();

  function chunkArray(arr: Music[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  }

  async function handleMusicPressAsync(music: Music) {
    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("PLAYLIST");
      await VirtualMusicPlayerService.playMusicAsync(music, newSongs.data);
      navigation.push("PlayerControllerScreen");
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  const chunkedData = chunkArray(newSongs.data ?? [], 3);

  const theme = useTheme();
  return (
    <View>
      {newSongs.isFetching && (
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 16 }}
          showsHorizontalScrollIndicator={false}
        >
          {new Array(2).fill("-").map((it, index) => {
            return (
              <View style={{ gap: 16 }} key={index.toString()}>
                {new Array(3).fill("-").map((it, index) => {
                  return (
                    <SkeletonLoader
                      key={index.toString()}
                      height={70}
                      width={300}
                      cornerRadius={40}
                      colors={["transparent", theme.colors.inversePrimary, "transparent"]}
                      primaryBackground={theme.colors.secondaryContainer}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}

      {newSongs.data && !newSongs.isFetching && (
        <Fragment>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.primary, fontWeight: "bold", marginBottom: 16 }}
          >
            Latest Songs
          </Text>
          <FlatList
            data={chunkedData}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ gap: 16 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "column", gap: 16 }}>
                {item.map((music, idx) => (
                  <View
                    key={music.videoId}
                    style={{
                      backgroundColor: theme.colors.secondaryContainer,
                      borderRadius: 40,
                      overflow: "hidden",
                      marginBottom: 10,
                      width: 300,
                    }}
                  >
                    <MusicListItem onPress={handleMusicPressAsync} music={music} />
                  </View>
                ))}
              </View>
            )}
          />
        </Fragment>
      )}
    </View>
  );
}
