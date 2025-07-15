import { AbstractStreamingService } from "~/abstracts";
import { HostedBackendApi } from "~/api";

class DefaultStreamingService extends AbstractStreamingService {
  public readonly NAME: string = "DefaultStreamingService";

  async setup(): Promise<void> {
    // Do Nothing
  }
  async getStreamURLAsync(musicId: string): Promise<string | undefined> {
    return await HostedBackendApi.getStreamingInfoAsync(musicId);
  }
}

export default new DefaultStreamingService();
