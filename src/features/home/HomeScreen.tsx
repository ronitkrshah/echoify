import { Fragment, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InnertubeApi } from "~/api";
import { asyncFuncExecutor } from "~/utils";
import { Playlist } from "~/models";
import Animated, { FadeIn } from "react-native-reanimated";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "HomeScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

type TPlaylist = {
  title: string;
  iconName: string;
  items: Playlist[];
};

export default function HomeScreen({ navigation }: TProps) {
  const [playlists, setPlaylists] = useState<TPlaylist[]>();
  const theme = useTheme();

  async function bootStrapAsync() {
    setPlaylists([]);
    const [romanticList] = await asyncFuncExecutor(() =>
      InnertubeApi.serachPlaylistsAsync("Romanitc Mix")
    );
    const [emraanHashmiList] = await asyncFuncExecutor(() =>
      InnertubeApi.serachPlaylistsAsync("Emraan Hashmi")
    );

    const updatedData: TPlaylist[] = [];
    if (romanticList) {
      updatedData.push({ title: "Romantic Mix", iconName: "heart-multiple", items: romanticList });
    }
    if (emraanHashmiList) {
      updatedData.push({ title: "Top Loved", iconName: "puzzle-heart", items: emraanHashmiList });
    }
    setPlaylists(updatedData);
  }

  useEffect(() => {
    bootStrapAsync();
    console.log("ok");
    
  }, []);

  return (
    <Fragment>
      <View style={styles.container}>
        {/* Fake Searchbar :) */}
        <Pressable
          style={[{ backgroundColor: theme.colors.elevation.level5 }, styles.searchBar]}
          onPress={() => {
            navigation.push("SearchScreen");
          }}
        >
          <MaterialDesignIcons name="magnify" size={24} />
          <Text variant="titleMedium">Search Songs...</Text>
        </Pressable>

        <FlatList
          data={playlists}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ gap: 26 }}
          renderItem={({ item }) => {
            return (
              <Fragment>
                <View
                  style={{ flexDirection: "row", gap: 16, alignItems: "center", marginBottom: 16 }}
                >
                  <MaterialDesignIcons
                    name={item.iconName as any}
                    size={40}
                    color={theme.colors.primary}
                  />

                  <Text
                    variant="titleLarge"
                    style={{ color: theme.colors.primary, fontWeight: "bold" }}
                  >
                    {item.title}
                  </Text>
                </View>
                <FlatList
                  data={item.items}
                  keyExtractor={(item) => item.id}
                  horizontal
                  contentContainerStyle={{ gap: 16 }}
                  renderItem={({ item: playlist, index }) => {
                    return (
                      <Animated.View
                        style={{ borderRadius: 20, overflow: "hidden" }}
                        entering={FadeIn.delay(index * 100)}
                      >
                        <Pressable
                          onPress={() =>
                            navigation.push("YoutubePlaylistDetailsScreen", {
                              playlistId: playlist.id,
                            })
                          }
                          android_ripple={{ color: theme.colors.primaryContainer }}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 120,
                            gap: 16,
                            paddingVertical: 8,
                          }}
                        >
                          <Image
                            source={{ uri: playlist.thumbnail }}
                            height={100}
                            width={100}
                            style={{ borderRadius: 20 }}
                          />
                          <Text
                            variant="labelLarge"
                            style={{ textAlign: "center", paddingHorizontal: 6, width: "100%" }}
                            numberOfLines={2}
                          >
                            {playlist.title}
                          </Text>
                        </Pressable>
                      </Animated.View>
                    );
                  }}
                />
              </Fragment>
            );
          }}
        />
      </View>
      <FAB
        icon={"disc-player"}
        style={styles.fab}
        onPress={() => {
          navigation.push("PlayerControllerScreen");
        }}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
