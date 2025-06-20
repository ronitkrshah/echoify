import Innertube from "youtubei.js";
import innertube from "./lib/youtube";
import { Music, Playlist } from "~/models";
import { PlaylistVideo, Video } from "node_modules/youtubei.js/dist/src/parser/nodes";
import moment from "moment";

class InnertubeApi {
  private _innertube?: Innertube;

  private async getInnertubeAsync(): Promise<Innertube> {
    if (!this._innertube) {
      this._innertube = await innertube;
    }
    return this._innertube;
  }

  public async searchMusicsAsync(query: string) {
    const yt = await this.getInnertubeAsync();
    const data = await yt.search(query, { type: "video" });
    const retVal: Music[] = [];

    for (const reslut of data.results) {
      try {
        const video = reslut.as(Video);
        retVal.push(
          new Music(
            video.video_id,
            video.title.text ?? "Unknown",
            video.author.name,
            video.author.url,
            video.duration.seconds,
            video.best_thumbnail?.url ?? ""
          )
        );
      } catch (error) {}
    }

    return retVal;
  }

  public async serachPlaylistsAsync(query: string) {
    const yt = await this.getInnertubeAsync();
    const data = await yt.search(query, { type: "playlist" });

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
    const yt = await this.getInnertubeAsync();
    const data = await yt.getStreamingData(videoId, { quality: "best" });
    return data.url;
  }

  public async getNextMusicAsync(videoId: string, index = 0) {
    const yt = await this.getInnertubeAsync();
    const videoInfo = await yt.getInfo(videoId);

    if (videoInfo.watch_next_feed) {
      const video = videoInfo.watch_next_feed[index] as Video;

      return new Music(
        video.video_id,
        video.title.text ?? "Unknown",
        video.author.name,
        video.author.url,
        parseInt(moment(video.duration.text, "mm:ss").format("mmss")),
        video.best_thumbnail?.url ?? ""
      );
    }
  }

  public async getSearchSuggestionsAsync(query: string) {
    const yt = await this.getInnertubeAsync();
    const suggestions = await yt.getSearchSuggestions(query);
    return suggestions;
  }

  public async getPlaylistDetialsAsync(playlistId: string) {
    const yt = await this.getInnertubeAsync();

    const info = await yt.getPlaylist(playlistId);

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
          video.author.url,
          video.duration.seconds,
          video.thumbnails[0].url
        )
      );
    });

    return { ...basicInfo, videos };
  }
}

export default new InnertubeApi();
