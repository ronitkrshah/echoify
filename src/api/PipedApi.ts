import { TSearchPlaylist } from "./types/playlist";
import { TVideoStreamResult } from "./types/stream";
import { TSearchVideo } from "./types/video";

type TSearchFilters = "all" | "music_videos" | "playlists" | "music_songs";

class PipedApi {
  private _url: string | undefined = undefined;

  public setPipedApiUrl(url: string) {
    this._url = url;
  }

  public async searchWithQueryAsync<T>(
    query: string,
    filterOption: TSearchFilters = "all"
  ): Promise<T> {
    const queryParam = new URLSearchParams();
    queryParam.append("q", query);
    queryParam.append("filter", filterOption);

    const response = await fetch(`${this._url}/search?${queryParam.toString()}`);
    return (await response.json()).items;
  }

  public async getVideoStreamingInfoAsync(videoUrl: string): Promise<TVideoStreamResult> {
    const videoId = videoUrl.split("=").pop();

    if (!videoId) {
      throw new Error("Invalid URL");
    }
    const response = await fetch(`${this._url}/streams/${videoId}`);
    return await response.json();
  }

  public async getSearchSuggestionsAsync(query: string): Promise<string[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("query", query);
    const response = await fetch(`${this._url}/suggestions?${queryParams.toString()}}`);
    return await response.json();
  }
}

export default new PipedApi();
