import { InnertubeApi } from "~/api";
import { asyncFuncExecutor, LocalStorage } from "~/core/utils";
import { Music } from "~/models";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

const storageKey = "musicSaveDirectory";

async function getDirectoryForSAF(): Promise<string | null> {
  const cachedDir = await LocalStorage.getItem(storageKey);
  if (cachedDir) return cachedDir;

  const result = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (result.granted && result.directoryUri) {
    LocalStorage.setItem(storageKey, result.directoryUri);
    return result.directoryUri;
  }

  return null;
}

export async function saveMusicToDeviceAsync(music: Music) {
  const [url] = await asyncFuncExecutor(() => InnertubeApi.getStreamingInfoAsync(music.videoId));
  if (!url) throw new Error("No Streams Available");

  const tempFilePath = FileSystem.cacheDirectory + `${music.title}.m4a`;

  const downloadResumable = FileSystem.createDownloadResumable(url, tempFilePath);
  const downloadResult = await downloadResumable.downloadAsync();
  if (!downloadResult || !downloadResult.uri) throw new Error("Download failed");

  if (Platform.OS === "android") {
    const apiLevel = Number(Platform.Version);

    if (apiLevel >= 30) {
      const dirUri = await getDirectoryForSAF();
      if (!dirUri) throw new Error("No directory access granted");

      const dest = await FileSystem.StorageAccessFramework.createFileAsync(
        dirUri,
        `${music.title}.m4a`,
        "audio/m4a"
      );

      const blob = await FileSystem.readAsStringAsync(tempFilePath, { encoding: "base64" });

      await FileSystem.StorageAccessFramework.writeAsStringAsync(dest, blob, {
        encoding: "base64",
      });
    } else {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permission not granted");

      const asset = await MediaLibrary.createAssetAsync(tempFilePath);
      const album = await MediaLibrary.getAlbumAsync("Download");

      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      }
    }
  }
}
