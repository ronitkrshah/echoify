import { useEffect, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Dialog, Portal, Text } from "react-native-paper";
import { Database } from "~/database";
import { PlaylistEntity } from "~/database/entities";

type TProps = {
  visible: boolean;
  onDimiss?(): void;
};

export default function AddMusicToPlaylistDialog({ visible, onDimiss }: TProps) {
  const [playlists, setPlaylists] = useState<PlaylistEntity[]>([]);

  async function getPlaylistsAsync() {
    const repo = Database.datasource.getRepository(PlaylistEntity);
    return repo.find();
  }

  useEffect(() => {
    if (visible) {
      getPlaylistsAsync().then(setPlaylists);
    }
  }, [visible]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDimiss}>
        <Dialog.Title>Playlists</Dialog.Title>
        <Dialog.Content style={{ maxHeight: Dimensions.get("screen").height * 0.6 }}>
          {playlists.map((it) => {
            return (
              <View>
                <Pressable>
                  <Text>{it.name}</Text>
                </Pressable>
              </View>
            );
          })}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
