import { AbstractStreamingService } from "~/abstracts";
import Innertube from "youtubei.js";
import { getInnertube } from "./lib/youtube";

class InnertubeStreamingService extends AbstractStreamingService {
  public readonly NAME: string = "InnertubeStreamingService";
  private _innertube!: Innertube;

  public async setup() {
    if (!this._innertube) {
      this._innertube = await getInnertube();
    }
  }

  async getStreamURLAsync(musicId: string): Promise<string | undefined> {
    const data = await this._innertube.getStreamingData(musicId);
    return data.url;
  }
}

export default new InnertubeStreamingService();
