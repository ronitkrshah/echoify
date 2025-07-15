export abstract class AbstractStreamingService {
  abstract readonly NAME: string;

  abstract setup(): Promise<void>;

  abstract getStreamURLAsync(musicId: string): Promise<string | undefined>;
}
