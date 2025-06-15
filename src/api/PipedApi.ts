import { TSearchPlaylist } from "./types/TSearchPlaylist";
import { TSearchVideo } from "./types/TSearchVideo";

class PipedApi {
  private _url: string | undefined = undefined;

  public setPipedApiUrl(url: string) {
    this._url = url;
  }

  private async searchWithQueryAsync<T>(query: string, filterOption: string): Promise<T> {
    const queryParam = new URLSearchParams();
    queryParam.append("q", query);
    queryParam.append("filter", filterOption);

    const response = await fetch(`${this._url}/search?${queryParam.toString()}`);
    return (await response.json()).items;
  }

  public async searchVideosAsync(query: string): Promise<TSearchVideo[]> {
    return await this.searchWithQueryAsync<TSearchVideo[]>(query, "videos");
  }

  public async searchPlaylistsAsync(query: string): Promise<TSearchPlaylist[]> {
    return await this.searchWithQueryAsync<TSearchPlaylist[]>(query, "playlists");
  }

  public async getVideoStreamingInfoAsync(videoUrl: string) {
    const videoId = videoUrl.split("=").pop();

    if (videoId) {
      const response = await fetch(`${this._url}/streams/${videoId}`);
      return await response.json();
    }
  }

  public async getSearchSuggestionsAsync(query: string): Promise<string[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("query", query);
    const response = await fetch(`${this._url}/suggestions?${queryParams.toString()}}`);
    return await response.json();
  }
}

export default new PipedApi();
