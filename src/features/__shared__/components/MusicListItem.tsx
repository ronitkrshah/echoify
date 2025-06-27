import moment from "moment";
import { Image, Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { musicDurationFormatter } from "~/core/utils";
import { Music } from "~/models";

type TProps = {
  music: Music;
  onPress?(music: Music): void;
  onLongPress?(music: Music): void;
};

export default function MusicListItem({ music, onPress, onLongPress }: TProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onPress?.(music)}
      onLongPress={() => onLongPress?.(music)}
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
  );
}
