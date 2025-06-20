import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Button, Dimensions, FlatList, StyleSheet, TextInput, View } from "react-native";
import { Divider, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { useAlertDialog } from "~/core/components";
import { Database } from "~/database";
import { PlaylistEntity } from "~/database/entities";
import { TStackNavigationRoutes } from "~/navigation";
import { LocalPlaylistRepository } from "~/repositories";
import { sleepThreadAsync } from "~/utils";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "PlaylistDetailsScreen">;

export default function PlaylistDetailsScreen({ navigation, route }: TProps) {
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistEntity | null>();
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);

  const titleRef = useRef<TextInput>(null);

  const alertDialog = useAlertDialog();
  const theme = useTheme();

  function deletePlaysist(id: number) {
    alertDialog.show({
      title: "Delete",
      description: `Are you sure to delete playlist ${playlistInfo?.name}?`,
      confirmText: "YES I'M SURE",
      async onConfirm() {
        LocalPlaylistRepository.deletePlaylistAsync(route.params.playlistId);
        navigation.goBack();
      },
    });
  }

  useEffect(() => {
    LocalPlaylistRepository.getPlaylistWithIdAsync(route.params.playlistId).then(setPlaylistInfo);
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
    </View>
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
