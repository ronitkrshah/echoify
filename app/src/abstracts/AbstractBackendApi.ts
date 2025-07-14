import { Music, Playlist } from "~/models";
import { TPlaylistDetails } from "~/types";

export abstract class AbstractBackendApi {
  abstract readonly NAME: string;

  abstract setup(): Promise<void>;

  abstract searchMusicsAsync(query: string): Promise<Music[]>;

  abstract serachPlaylistsAsync(query: string): Promise<Playlist[]>;

  abstract getStreamingInfoAsync(videoId: string): Promise<string | undefined>;

  abstract getRealtedMusic(videoId: string): Promise<Music[]>;

  abstract getSearchSuggestionsAsync(query: string): Promise<string[]>;

  abstract getPlaylistDetialsAsync(playlistId: string): Promise<TPlaylistDetails>;
}
