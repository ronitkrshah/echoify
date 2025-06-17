import Innertube from "youtubei.js";
import innertube from "./lib/youtube";
import { Music } from "~/models";
import { Video } from "node_modules/youtubei.js/dist/src/parser/nodes";
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
            parseInt(moment(video.duration.text, "mm:ss").format("mmss")),
            video.best_thumbnail?.url ?? ""
          )
        );
      } catch (error) {}
    }

    return retVal;
  }

  public async getStreamingInfoAsync(videoId: string) {
    const yt = await this.getInnertubeAsync();
    const data = await yt.getStreamingData(videoId, { quality: "best" });
    return data.url;
  }

  public async getSearchSuggestionsAsync(query: string) {
    const yt = await this.getInnertubeAsync();
    const suggestions = await yt.getSearchSuggestions(query);
    return suggestions;
  }
}

export default new InnertubeApi();
