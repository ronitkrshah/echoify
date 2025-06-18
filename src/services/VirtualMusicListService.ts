import TrackPlayer, { Event, Track } from "react-native-track-player";
import { InnertubeApi } from "~/api";
import { Music } from "~/models";
import { asyncFuncExecutor } from "~/utils";

/**
 * The virtual list will help to track the current track and
 * and upcoming tracks. It will be synced through RNTP to provide
 * queue list for UI.
 *
 * This class will handle upcoming music
 */
class VirtualMuisicListService {
  private _queue: Music[] = [];

  private _queueType: "PLAYLIST" | "NORMAL" = "NORMAL";

  // Hot reloading might add multiple event listeners
  private _isInitialized = false;
  private _isEventProcessing = false;

  public constructor() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
      if (this._isEventProcessing) return; // Prevent overlapping or looping events
      this._isEventProcessing = true;

      try {
        if (!event.track) return;
        const currentTrackId = event.track.id as string;

        const [nextTrack] = await asyncFuncExecutor(() =>
          this.getNextTrackFromQueueListAsync(currentTrackId)
        );

        if (nextTrack) {
          await TrackPlayer.add(nextTrack);
          return;
        }

        if (this._queueType === "PLAYLIST") {
          return;
        }

        const [nextMusic] = await asyncFuncExecutor(() =>
          InnertubeApi.getNextVideoAsync(currentTrackId)
        );

        if (nextMusic) {
          const [nextTrack] = await asyncFuncExecutor(() => this.getTrackFromMusicAsync(nextMusic));

          if (nextTrack) {
            this._queue.push(nextMusic);
            await TrackPlayer.add([nextTrack]);
          }
        }
      } finally {
        this._isEventProcessing = false; // Ensure flag is reset even on error
      }
    });
  }

  get queue() {
    return this._queue;
  }

  public setQueueType(type: typeof this._queueType) {
    this._queueType = type;
  }

  private async getNextTrackFromQueueListAsync(musicId: string) {
    let nextMusic: Music | undefined;

    // Expensive Func :)
    this._queue.forEach((it, index) => {
      if (it.videoId !== musicId) return;
      if (index === this._queue.length - 1) return;

      nextMusic = this._queue[index + 1];
    });
    if (nextMusic) return await this.getTrackFromMusicAsync(nextMusic);
  }

  /** This method will not update actual track player queue */
  public addMusicsToQueue(musics: Music[]) {
    this._queue = [...this._queue, ...musics];
  }

  /** This method will also clear queue in TrackPlayer */
  public async resetAsync() {
    this._queueType = "NORMAL";
    this._queue = [];
    await TrackPlayer.reset();
  }

  public async getTrackFromMusicAsync(music: Music) {
    const [url, error] = await asyncFuncExecutor(() =>
      InnertubeApi.getStreamingInfoAsync(music.videoId)
    );
    if (!url) {
      throw new Error(error?.message || "Unable To Fetch Stream");
    }

    return Music.convertMusicToRNTPTrack(music, url);
  }
}

export default new VirtualMuisicListService();
