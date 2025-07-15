import Innertube from "youtubei.js";
import { getInnertube } from "./lib/youtube";
import { Music, Playlist } from "~/models";
import { AbstractBackendApi } from "~/abstracts";
import { TPlaylistDetails } from "~/types";
import {
  Message,
  MusicCarouselShelf,
  MusicResponsiveListItem,
  MusicShelf,
  PlaylistVideo,
} from "node_modules/youtubei.js/dist/src/parser/nodes";

class InnertubeApi extends AbstractBackendApi {
  public readonly NAME = "InnertubeApi";
  private _innertube!: Innertube;

  public async setup() {
    if (!this._innertube) {
      this._innertube = await getInnertube();
    }
  }

  public async searchMusicsAsync(query: string): Promise<Music[]> {
    const data = await this._innertube.music.search(query, {
      type: "song",
    });

    if (!data.contents) return [];

    let musicShelf: MusicShelf | undefined = undefined;

    for (const item of data.contents) {
      if (item.type === MusicShelf.name) {
        musicShelf = item as MusicShelf;
        break;
      }
    }

    if (!musicShelf) return [];

    const retVal = [];

    for (const music of musicShelf.contents) {
      try {
        retVal.push(
          new Music(
            music.id!,
            music.title! ?? "Unknown Track",
            music.artists?.map((it) => it.name).join(", ") ?? "Unknown Artist",
            music.duration?.seconds || 0,
            music.thumbnails[0].url
          )
        );
      } catch (error) {}
    }

    return retVal;
  }

  public async serachPlaylistsAsync(query: string): Promise<Playlist[]> {
    const data = await this._innertube.music.search(query, {
      type: "playlist",
    });

    if (!data.contents) return [];
    let musicShelf: MusicShelf | undefined;

    for (const item of data.contents) {
      if (item.type === MusicShelf.name) {
        musicShelf = item as MusicShelf;
        break;
      }
    }

    if (!musicShelf) return [];

    const retval = [];

    for (const playlist of musicShelf.contents) {
      retval.push(
        new Playlist(
          playlist.id!,
          playlist.title ?? "Unknown",
          playlist.thumbnail?.contents[0].url!
        )
      );
    }

    return retval;
  }

  public async getStreamingInfoAsync(videoId: string): Promise<string | undefined> {
    const data = await this._innertube.getStreamingData(videoId);
    return data.url;
  }

  public async getRealtedMusic(videoId: string): Promise<Music[]> {
    const list = await this._innertube.music.getRelated(videoId);

    if (list.is(Message)) {
      return [];
    }

    const retVal = [];

    for (const music of list.contents[0].as(MusicCarouselShelf)
      .contents as MusicResponsiveListItem[]) {
      try {
        retVal.push(
          new Music(
            music.id!,
            music.title! ?? "Unknown Track",
            music.artists?.map((it) => it.name).join(", ") ?? "Unknown Artist",
            music.duration?.seconds || 0,
            music.thumbnails[0].url
          )
        );
      } catch (error) {
        return [];
      }
    }

    return retVal;
  }

  public async getSearchSuggestionsAsync(query: string): Promise<string[]> {
    const suggestions = await this._innertube.getSearchSuggestions(query);
    return suggestions;
  }

  public async getPlaylistDetialsAsync(playlistId: string): Promise<TPlaylistDetails> {
    const info = await this._innertube.getPlaylist(playlistId);

    const basicInfo = {
      title: info.info.title!,
      totalVideos: info.info.total_items,
      thumbnail: info.info.thumbnails[0].url,
    };

    const videos: Music[] = [];

    info.videos.forEach((it) => {
      const video = it.as(PlaylistVideo);
      videos.push(
        new Music(
          video.id,
          video.title.text ?? "Unknown",
          video.author.name,
          video.duration.seconds,
          video.thumbnails[0].url
        )
      );
    });

    return { ...basicInfo, videos };
  }
}

export default new InnertubeApi();
