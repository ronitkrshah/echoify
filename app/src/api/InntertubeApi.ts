import { Music, Playlist } from "~/models";

type TApiMusic = {
  id: string;
  title: string;
  author: string;
  duration: number;
  thumbnail: string;
};

type TApiPlaylist = {
  id: string;
  name: string;
  thumbnail: string;
};

type TPlaylistInfo = {
  title: string;
  totalVideos: string;
  thumbnail: string;
  videos: TApiMusic[];
};

class InnertubeApi {
  private readonly _backendApi;

  public constructor() {
    this._backendApi = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`;
  }

  public async searchMusicsAsync(query: string) {
    const response = await fetch(`${this._backendApi}/songs?q=${query}`);
    const data = await response.json();

    if (!data.status) throw new Error(data.message);

    const songs = data.data as TApiMusic[];
    return songs.map((it) => new Music(it.id, it.title, it.author, it.duration, it.thumbnail));
  }

  public async serachPlaylistsAsync(query: string) {
    const response = await fetch(`${this._backendApi}/playlists?q=${query}`);
    const data = await response.json();

    if (!data.status) throw new Error(data.message);

    const playlists = data.data as TApiPlaylist[];
    return playlists.map((it) => new Playlist(it.id, it.name, it.thumbnail));
  }

  public async getStreamingInfoAsync(videoId: string): Promise<string> {
    const response = await fetch(`${this._backendApi}/stream/${videoId}`);
    const data = await response.json();

    if (data.status) {
      return data.data;
    }

    throw new Error(data.message);
  }

  public async getRealtedMusic(videoId: string) {
    const response = await fetch(`${this._backendApi}/relatedSongs/${videoId}`);
    const data = await response.json();

    if (!data.status) throw new Error(data.message);

    const songs = data.data as TApiMusic[];
    return songs.map((it) => new Music(it.id, it.title, it.author, it.duration, it.thumbnail));
  }

  public async getSearchSuggestionsAsync(query: string): Promise<string[]> {
    const response = await fetch(`${this._backendApi}/searchSuggestions?q=${query}`);
    const data = await response.json();

    if (data.status) {
      return data.data;
    }

    throw new Error(data.message);
  }

  public async getPlaylistDetialsAsync(playlistId: string) {
    const response = await fetch(`${this._backendApi}/playlists/${playlistId}`);
    const data = (await response.json()).data as TPlaylistInfo;

    const videos: Music[] = [];

    data.videos.forEach((it) => {
      videos.push(new Music(it.id, it.title, it.author, it.duration, it.thumbnail));
    });

    return { title: data.title, totalVideos: data.totalVideos, thumbnail: data.thumbnail, videos };
  }
}

export default new InnertubeApi();
