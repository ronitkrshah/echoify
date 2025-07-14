import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, ToastAndroid } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { Database } from "~/database";
import { PlaylistEntity } from "~/database/entities";
import { LocalPlaylistRepository } from "~/repositories";

type TProps = {
  visible: boolean;
  onDismiss?(): void;
  onPlaylistCreate?(): void;
};

export default function NewPlaylistDialog({ visible, onDismiss, onPlaylistCreate }: TProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [dialogBottomPosition, setDialogBottomPosition] = useState(0);

  function handleDialogPositionOnKeyboardChange(e: KeyboardEvent) {
    if (e.endCoordinates.height > 0) {
      setDialogBottomPosition(-100);
    } else {
      setDialogBottomPosition(0);
    }
  }

  async function saveNewPlaylistAsync(name: string) {
    if (!name || typeof name !== "string" || name === "") {
      ToastAndroid.show("Invalid Playlist Name", ToastAndroid.SHORT);
      return;
    }
    setPlaylistName("")
    await LocalPlaylistRepository.createNewPaylistAsync(name)
    onPlaylistCreate?.()
  }

  useEffect(() => {
    // Android Specific Only
    const keyboardHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleDialogPositionOnKeyboardChange
    );
    const keyboardShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleDialogPositionOnKeyboardChange
    );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ transform: [{ translateY: dialogBottomPosition }] }}
      >
        <Dialog.Title>New Playlist</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={playlistName}
            onChangeText={setPlaylistName}
            placeholder="Playlist Name"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => saveNewPlaylistAsync(playlistName)}>SAVE</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
