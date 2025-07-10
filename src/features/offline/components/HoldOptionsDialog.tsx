import { Pressable, View } from "react-native";
import { Dialog, Portal, Text, useTheme } from "react-native-paper";
import { Music } from "~/models";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import * as Sharing from "expo-sharing";

type TProps = {
  music: Music;
  visible: boolean;
  onDismiss?(): void;
};

export default function HoldOptionsDialog({ visible, onDismiss, music }: TProps) {
  const theme = useTheme();

  const dialogActions = [
    {
      title: "Share",
      icon: "share-variant",
      async onPress() {
        if (!(await Sharing.isAvailableAsync())) return;
        Sharing.shareAsync(music.streamingLink!);
      },
    },
    // {
    //   title: "Delete",
    //   icon: "trash-can",
    //   onPress() {},
    // },
  ];

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
          {dialogActions.map((it) => {
            return (
              <View key={it.title} style={{ borderRadius: 14, overflow: "hidden" }}>
                <Pressable
                  onPress={() => {
                    onDismiss?.();
                    it.onPress();
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
  );
}
