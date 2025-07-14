import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, TextInput, ToastAndroid, View } from "react-native";
import { IconButton, Menu, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAlertDialog, useLoadingDialog } from "~/core/components";
import { PlaylistEntity } from "~/database/entities";
import { TStackNavigationRoutes } from "~/navigation";
import { LocalPlaylistRepository } from "~/repositories";
import { sleepThreadAsync } from "~/core/utils";
import { MusicListItem } from "../__shared__/components";
import { Music } from "~/models";
import { VirtualMusicPlayerService } from "~/core/services";
import { usePlayerController } from "~/core/playerController";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "PlaylistDetailsScreen">;

export default function PlaylistDetailsScreen({ navigation, route }: TProps) {
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistEntity | null>();
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);

  const titleRef = useRef<TextInput>(null);

  const loadingDialog = useLoadingDialog();
  const alertDialog = useAlertDialog();
  const playerController = usePlayerController();
  const theme = useTheme();

  function deletePlaysist(id: number) {
    alertDialog.show({
      title: "Delete",
      description: `Are you sure to delete playlist ${playlistInfo?.name}?`,
      confirmText: "YES I'M SURE",
      async onConfirm() {
        loadingDialog.show()
        await LocalPlaylistRepository.deletePlaylistAsync(route.params.playlistId);
        loadingDialog.dismiss()
        navigation.goBack();
      },
    });
  }

  async function handleMusicPressAsync(music: Music) {
    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("PLAYLIST");
      await VirtualMusicPlayerService.playMusicAsync(
        music,
        playlistInfo?.songs.map((it) => Music.convertFromSongEntity(it))
      );
      playerController.showModal();
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  useEffect(() => {
    LocalPlaylistRepository.getPlaylistWithIdAsync(route.params.playlistId).then(setPlaylistInfo);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.rootContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <View style={styles.playlistDetails}>
          <View style={{ flex: 1 }}>
            <TextInput
              ref={titleRef}
              multiline={!isTitleEditing}
              editable={isTitleEditing}
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
                fontSize: 34,
                paddingLeft: 0,
              }}
              onSubmitEditing={(e) => {
                if (playlistInfo)
                  LocalPlaylistRepository.updatePlaylistTitleAsync(
                    playlistInfo?.id,
                    e.nativeEvent.text
                  );
                setIsTitleEditing(false);
              }}
            >
              {playlistInfo?.name}
            </TextInput>
            <Text variant="titleMedium">
              {Array.isArray(playlistInfo?.songs) ? playlistInfo.songs.length : 0} Songs
            </Text>
          </View>
          <View>
            <Menu
              contentStyle={{ borderRadius: 20 }}
              visible={showPlaylistOptions}
              onDismiss={() => setShowPlaylistOptions(false)}
              anchor={
                <IconButton icon={"dots-vertical"} onPress={() => setShowPlaylistOptions(true)} />
              }
            >
              {[
                {
                  title: "Edit Title",
                  onPress: async () => {
                    setShowPlaylistOptions(false);
                    setIsTitleEditing(true);
                    await sleepThreadAsync(300);
                    titleRef.current?.focus();
                  },
                },
                {
                  title: "Delete Playlist",
                  onPress: () => {
                    setShowPlaylistOptions(false);
                    deletePlaysist(route.params.playlistId);
                  },
                },
              ].map((it) => {
                return <Menu.Item key={it.title} onPress={it.onPress} title={it.title} />;
              })}
            </Menu>
          </View>
        </View>
      </View>
      <FlatList
        data={playlistInfo?.songs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              style={{ borderRadius: 32, overflow: "hidden", paddingHorizontal: 8 }}
              entering={FadeInDown.delay(index * 100)}
            >
              <MusicListItem
                music={Music.convertFromSongEntity(item)}
                onPress={handleMusicPressAsync}
              />
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
    elevation: 4,
    padding: 30,
    height: Dimensions.get("screen").height * 0.45,
  },
  playlistDetails: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
