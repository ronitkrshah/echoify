import * as Application from "expo-application";
import * as Device from "expo-device";
import RNFS from "react-native-fs";
import { install as InstallAPK } from "react-native-package-installer";

type GitHubRelease = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: {
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string | null;
    uploader: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      user_view_type: string;
      site_admin: boolean;
    };
    content_type: string;
    state: string;
    size: number;
    digest: string | null;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
  }[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  mentions_count: number;
};

class AppUpdateService {
  private _isFetching = false;

  public async getUpdateAsync() {
    if (this._isFetching) return;
    this._isFetching = true;

    try {
      const response = await fetch(`https://api.github.com/repos/ronitkrshah/echoify/releases`);

      if (!response.ok) {
        throw new Error("Unable To Fetch Updated");
      }

      return (await response.json()) as GitHubRelease[];
    } catch (e) {
      throw new Error((e as Error).message);
    } finally {
      this._isFetching = false;
    }
  }

  public isUpdateAvailable(releaseTag: string) {
    const tagVersion = releaseTag.slice(1);
    if (Application.nativeApplicationVersion !== tagVersion) {
      return true;
    } else {
      return false;
    }
  }

  public async downloadUpdateAndInstallPackageAsync(assets: GitHubRelease["assets"]) {
    const downloadLink = this.getDownloadLinkBasedOnArchietecture(assets);

    await RNFS.downloadFile({
      fromUrl: downloadLink,
      toFile: RNFS.CachesDirectoryPath + "/latest.apk",
    }).promise;

    const status = await InstallAPK(["file:///" + RNFS.CachesDirectoryPath + "/latest.apk"]);
    if (status === false) {
      throw new Error("Install Failed");
    }
  }

  private getDownloadLinkBasedOnArchietecture(assets: GitHubRelease["assets"]) {
    const ARM_64_V8A = "arm64-v8a";
    const ARMEABI_V7A = "armeabi-v7a";
    const supportedArchs = Device.supportedCpuArchitectures || [];

    const asset = assets.find((it) => {
      if (supportedArchs.includes(ARM_64_V8A)) {
        return it.name.includes(ARM_64_V8A);
      }
      if (supportedArchs.includes(ARMEABI_V7A)) {
        return it.name.includes(ARMEABI_V7A);
      }
      return false;
    });

    if (!asset) {
      throw new Error("No compatible APK found for this device.");
    }

    return asset.browser_download_url;
  }
}

export default new AppUpdateService();
