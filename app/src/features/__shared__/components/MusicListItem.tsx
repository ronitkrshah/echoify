import moment from "moment";
import { Fragment, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Dialog, Portal, Text, useTheme } from "react-native-paper";
import { musicDurationFormatter } from "~/core/utils";
import { Music } from "~/models";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { DEFAULT_MUSIC_HOLD_OPTIONS } from "../constants";

type TProps = {
  music: Music;
  onPress?(music: Music): void;
  holdOptions?: { title: string; icon: string; onPress: (music: Music) => void }[];
};

export default function MusicListItem({
  music,
  onPress,
  holdOptions = DEFAULT_MUSIC_HOLD_OPTIONS,
}: TProps) {
  const [showOptions, setShowOptions] = useState(false);
  const theme = useTheme();

  return (
    <Fragment>
      <Portal>
        <Dialog visible={showOptions} onDismiss={() => setShowOptions(false)}>
          <Dialog.Content>
            {holdOptions.map((it) => {
              return (
                <View key={it.title} style={{ borderRadius: 14, overflow: "hidden" }}>
                  <Pressable
                    onPress={() => {
                      setShowOptions(false);
                      it.onPress(music);
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      flexDirection: "row",
                      gap: 8,
                    }}
                    android_ripple={{ color: theme.colors.primary }}
                  >
                    <MaterialIcons name={it.icon as any} size={24} color={theme.colors.primary} />
                    <Text variant="titleMedium">{it.title}</Text>
                  </Pressable>
                </View>
              );
            })}
          </Dialog.Content>
        </Dialog>
      </Portal>
      <Pressable
        onPress={() => onPress?.(music)}
        onLongPress={() => {
          if (holdOptions.length > 0) {
            setShowOptions(true);
          }
        }}
        android_ripple={{ color: theme.colors.primary }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 22,
          padding: 6,
        }}
      >
        <Image
          source={{ uri: music.thumbnail }}
          height={60}
          width={60}
          style={{ borderRadius: 30 }}
        />
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text numberOfLines={2}>{music.title}</Text>
            <Text
              style={{ fontStyle: "italic", color: theme.colors.secondary }}
              numberOfLines={1}
              variant="labelLarge"
            >
              {music.author}
            </Text>
          </View>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            {musicDurationFormatter(music.duration)}
          </Text>
        </View>
      </Pressable>
    </Fragment>
  );
}
