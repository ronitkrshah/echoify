import { Music } from "~/models";
import { SharedDownloadModule } from "../download";
import { ToastAndroid } from "react-native";

export const DEFAULT_MUSIC_HOLD_OPTIONS = [
  {
    title: "Download",
    icon: "download",
    async onPress(music: Music) {
      SharedDownloadModule.saveMusicToDeviceAsync(music)
        .then(() => {
          ToastAndroid.show("Music Saved To Device", ToastAndroid.SHORT);
        })
        .catch((e) => {
          console.log(e);

          ToastAndroid.show((e as Error).message, ToastAndroid.SHORT);
        });
    },
  },
];
