import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import { NewPlaylistDialog } from "./components";
import { Database } from "~/database";
import { PlaylistEntity } from "~/database/entities";
import Animated, { FadeIn, FadeInDown, LinearTransition } from "react-native-reanimated";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { LocalPlaylistRepository } from "~/repositories";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "PlaylistsScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function PlaylistScreen({ navigation }: TProps) {
  const [showPlaylistCreateDialog, setShowPlaylistCreateDialog] = useState(false);
  const [playlists, setPlaylists] = useState<Awaited<ReturnType<typeof LocalPlaylistRepository.getAllPlaylistAsync>>>([]);

  const theme = useTheme();  

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      LocalPlaylistRepository.getAllPlaylistAsync().then(setPlaylists)
    });

    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={{ flex: 1 }}>
          <Animated.FlatList
          layout={LinearTransition}
            ListEmptyComponent={() => (
              <View
                style={{
                  height: Dimensions.get("screen").height * 0.6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons name="playlist-plus" size={60} />
                <Text variant="titleLarge">You Don't Have Any Playlists</Text>
              </View>
            )}
            data={playlists}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ paddingVertical: 28, gap: 30 }}
            columnWrapperStyle={{
              justifyContent: "space-evenly",
            }}
            renderItem={({ item, index }) => {
              return (
                <Animated.View
                entering={FadeInDown.delay(index * 100).duration(500)}
                  style={{
                    width: Dimensions.get("screen").width * 0.4,
                    height: 150,
                    borderRadius: 20,
                    overflow: "hidden",
                    backgroundColor: theme.colors.primaryContainer,
                    elevation: 3,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.push("PlaylistDetailsScreen", { playlistId: item.id });
                    }}
                    android_ripple={{ color: theme.colors.primary }}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons name="playlist-music" size={70} />
                    <Text variant="titleMedium" numberOfLines={2} style={{ textAlign: "center" }}>
                      {item.name}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            }}
          />
        </View>

        <FAB
          style={styles.fab}
          icon={"plus"}
          label="New Playlist"
          onPress={() => setShowPlaylistCreateDialog(true)}
        />
      </View>
      <NewPlaylistDialog
        visible={showPlaylistCreateDialog}
        onDismiss={() => setShowPlaylistCreateDialog(false)}
        onPlaylistCreate={() => {
          setShowPlaylistCreateDialog(false);
          LocalPlaylistRepository.getAllPlaylistAsync().then(setPlaylists)
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
