import { TSearchPlaylist } from "./types/TSearchPlaylist";
import { TSearchVideo } from "./types/TSearchVideo";

export default class PipedApi {
  private static _url: string | undefined = undefined;

  public static setPipedApiUrl(url: string) {
    this._url = url;
  }

  private static async searchYoutubeData<T>(query: string, filterOption: string): Promise<T> {
    const queryParam = new URLSearchParams();
    queryParam.append("q", query);
    queryParam.append("filter", filterOption);

    const response = await fetch(`${this._url}/search?${queryParam.toString()}`);
    return (await response.json()).items;
  }

  public static async searchVideosAsync(query: string) {
    return await this.searchYoutubeData<TSearchVideo[]>(query, "videos");
  }

  public static async searchPlaylistsAsync(query: string) {
    return await this.searchYoutubeData<TSearchPlaylist[]>(query, "playlists");
  }

  public static async getVideoStreamingInfoAsync(videoUrl: string) {
    const videoId = videoUrl.split("=").pop();

    if (videoId) {
      const response = await fetch(`${this._url}/streams/${videoId}`);
      return await response.json();
    }
  }
}
