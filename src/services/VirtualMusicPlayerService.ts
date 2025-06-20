import TrackPlayer, {
  Event,
  PlaybackActiveTrackChangedEvent,
  Track,
} from "react-native-track-player";
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
class VirtualMuisicPlayerService {
  private _queue: Music[] = [];
  private _playedSongs = new Set<string>();

  private _queueType: "PLAYLIST" | "NORMAL" = "NORMAL";

  // Hot reloading might add multiple event listeners
  private _isInitialized = false;
  private _isEventProcessing = false;

  get queue() {
    return this._queue;
  }

  /**
   * This function is only meant for track player bg call
   */
  public async handlePlayBackActiveTrackChangeEventAsync(event: PlaybackActiveTrackChangedEvent) {
    if (this._isEventProcessing) return;
    if (!event.track) return;
    this._isEventProcessing = true;

    try {
      const currentTrackId = event.track.id as string;
      const nextQueueTrack = await this.getNextTrackFromQueueListAsync(currentTrackId);
      /**
       * If we have a track in local queue then add that to trackplayer
       * no need to call next song api
       */
      if (nextQueueTrack) {
        TrackPlayer.add(nextQueueTrack);
        return;
      }

      /**
       *  If we dont have next track it means it's the last track.
       * In this case we have to fetch next song and update both local and track player queue
       * but before that if the queue type is playlist then we don't have to do api calls
       * just stops the player
       */
      if (this._queueType === "PLAYLIST") return;

      let nextMusic: Music | undefined;
      /** Getting next Song */
      for (let index = 0; index < 3; index++) {
        const music = await InnertubeApi.getNextMusicAsync(currentTrackId, index);
        if (!music) continue;
        if (this._playedSongs.has(music.videoId)) continue;
        nextMusic = music;
        break;
      }

      if (!nextMusic) return;
      const nextTrack = await this.getRNTPTrackFromMusicAsync(nextMusic);

      /** Update Both queues */
      if (nextTrack) {
        this._queue.push(nextMusic);
        this._playedSongs.add(nextMusic.videoId);
        TrackPlayer.add(nextTrack);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this._isEventProcessing = false;
    }
  }

  public setQueueType(type: typeof this._queueType) {
    this._queueType = type;
  }

  private async getNextTrackFromQueueListAsync(currentTrackId: string) {
    let nextMusic: Music | undefined;

    // Expensive Func :)
    this._queue.forEach((it, index) => {
      if (it.videoId !== currentTrackId) return;
      if (index === this._queue.length - 1) return;

      nextMusic = this._queue[index + 1];
    });
    if (nextMusic) return await this.getRNTPTrackFromMusicAsync(nextMusic);
  }

  /** This method will not update actual track player queue */
  public addMusicsToQueue(musics: Music[]) {
    const songsWithoutDuplicates = musics.filter((it) => {
      if (this._playedSongs.has(it.videoId)) return false;
      this._playedSongs.add(it.videoId);
      return true;
    });
    this._queue = [...this._queue, ...songsWithoutDuplicates];
  }

  /** This method will also clear queue in TrackPlayer */
  public async resetAsync() {
    this._queueType = "NORMAL";
    this._playedSongs.clear();
    this._queue = [];
    await TrackPlayer.reset();
  }

  public async getRNTPTrackFromMusicAsync(music: Music) {
    const [url, error] = await asyncFuncExecutor(() =>
      InnertubeApi.getStreamingInfoAsync(music.videoId)
    );
    if (!url) {
      throw new Error(error?.message || "Unable To Fetch Stream");
    }

    return Music.convertMusicToRNTPTrack(music, url);
  }
}

export default new VirtualMuisicPlayerService();
