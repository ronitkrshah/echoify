import { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, ToastAndroid, View } from "react-native";
import { Dialog, IconButton, Portal, Text, useTheme } from "react-native-paper";
import { Database } from "~/database";
import { PlaylistEntity } from "~/database/entities";
import { Music } from "~/models";
import { LocalPlaylistRepository } from "~/repositories";

type TProps = {
  music: Music;
  visible: boolean;
  onDimiss?(): void;
};

export default function AddMusicToPlaylistDialog({ music, visible, onDimiss }: TProps) {
  const [playlists, setPlaylists] = useState<
    Awaited<ReturnType<typeof LocalPlaylistRepository.getAllPlaylistAsync>>
  >([]);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      LocalPlaylistRepository.getAllPlaylistAsync().then(setPlaylists);
    }
  }, [visible]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDimiss}>
        <Dialog.Title>Playlists</Dialog.Title>
        <Dialog.Content style={{ maxHeight: Dimensions.get("screen").height * 0.6 }}>
          <ScrollView
            contentContainerStyle={{ gap: 16, paddingVertical: 16, paddingHorizontal: 4 }}
          >
            {playlists.map((it) => {
              return (
                <View key={it.id.toString()}>
                  <View
                    style={{
                      backgroundColor: theme.colors.primaryContainer,
                      padding: 16,
                      borderRadius: 16,
                      elevation: 2,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                        {it.name}
                      </Text>
                      <Text variant="labelLarge">{it.songCount} Songs</Text>
                    </View>
                    <IconButton
                      icon={"plus"}
                      onPress={async () => {
                        onDimiss?.();
                        await LocalPlaylistRepository.addMusicToPlaylistAsync(it.id, music)
                        ToastAndroid.show("Song Added", ToastAndroid.SHORT)
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
