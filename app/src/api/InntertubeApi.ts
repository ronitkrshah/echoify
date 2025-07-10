import Innertube from "youtubei.js";
import innertube from "./lib/youtube";
import { Music, Playlist } from "~/models";
import { PlaylistVideo, Video } from "node_modules/youtubei.js/dist/src/parser/nodes";

class InnertubeApi {
  private _innertube!: Innertube;
  private _backendApi = process.env.EXPO_PUBLIC_API_URL;

  public async setupInnertube() {
    if (!this._innertube) {
      this._innertube = await innertube;
    }
    this._innertube;
  }

  public async searchMusicsAsync(query: string) {
    const data = await this._innertube.search(query, { type: "video" });
    const retVal: Music[] = [];

    for (const reslut of data.results) {
      try {
        const video = reslut.as(Video);
        retVal.push(
          new Music(
            video.video_id,
            video.title.text ?? "Unknown",
            video.author.name,
            video.duration.seconds,
            video.best_thumbnail?.url ?? ""
          )
        );
      } catch (error) {}
    }

    return retVal;
  }

  public async serachPlaylistsAsync(query: string) {
    const data = await this._innertube.search(query, { type: "playlist" });

    const retval: Playlist[] = [];
    data.results.forEach((it) => {
      const playlist = it as any;
      retval.push(
        new Playlist(
          playlist?.content_id,
          playlist?.metadata.title?.text,
          playlist?.content_image?.primary_thumbnail?.image[0]?.url
        )
      );
    });

    return retval;
  }

  public async getStreamingInfoAsync(videoId: string) {
    const response = await fetch(`${this._backendApi}/api/v1/music/stream/${videoId}`);
    const data = await response.json();
    if (data.status) {
      return data.url;
    }
    return data.message;
  }

  public async getNextMusicAsync(videoId: string, index = 0) {
    const videoInfo = await this._innertube.getInfo(videoId);

    if (videoInfo.watch_next_feed) {
      const video = videoInfo.watch_next_feed[index] as Video;

      return new Music(
        video.video_id,
        video.title.text ?? "Unknown",
        video.author.name,
        video.duration.seconds,
        video.best_thumbnail?.url ?? ""
      );
    }
  }

  public async getSearchSuggestionsAsync(query: string) {
    const suggestions = await this._innertube.getSearchSuggestions(query);
    return suggestions;
  }

  public async getPlaylistDetialsAsync(playlistId: string) {
    const info = await this._innertube.getPlaylist(playlistId);

    const basicInfo = {
      title: info.info.title,
      totalVideos: info.info.total_items,
      thumnail: info.info.thumbnails[0],
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
