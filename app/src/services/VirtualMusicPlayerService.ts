import TrackPlayer, {
  PlaybackActiveTrackChangedEvent,
  State,
  Track,
} from "react-native-track-player";
import { Music } from "~/models";
import RecentsRepository from "~/repositories/RecentsRepository";
import { asyncFuncExecutor } from "~/core/utils";
import SessionStorage from "~/core/utils/SessionStorage";
import { AbstractStreamingService } from "~/abstracts";
import { HostedBackendApi } from "~/api";

/**
 * The virtual list will help to track the current track and
 * and upcoming tracks. It will be synced through RNTP to provide
 * queue list for UI.
 *
 * This class will handle upcoming music
 */
class VirtualMusicPlayerService {
  private _queue: Music[] = [];

  private _queueType: "PLAYLIST" | "NORMAL" = "NORMAL";
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

    // Prevent further exec is track is stopped
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === State.Stopped) return;

    try {
      RecentsRepository.addSongToRecentsAsync(event.track as Track & { id: string });
    } catch (error) {
      console.log("Recent Adding Error:", error);
    }

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
      const relatedMusics = await HostedBackendApi.getRealtedMusic(currentTrackId);
      this.addMusicsToQueue(relatedMusics);
      const nextTrack = await this.getRNTPTrackFromMusicAsync(relatedMusics[0]);
      TrackPlayer.add(nextTrack);
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
    const currentIndex = this._queue.findIndex((it) => it.videoId === currentTrackId);
    if (currentIndex === -1 || currentIndex >= this._queue.length - 1) return;

    const nextMusic = this._queue[currentIndex + 1];
    return this.getRNTPTrackFromMusicAsync(nextMusic);
  }

  /** This method will not update actual track player queue */
  public addMusicsToQueue(musics: Music[]) {
    this._queue.push(...musics);
  }

  /** This method will also clear queue in TrackPlayer */
  public async resetAsync() {
    this._queueType = "NORMAL";
    this._queue = [];
    await TrackPlayer.reset();
  }

  public async getRNTPTrackFromMusicAsync(music: Music) {
    if (music?.streamingLink) {
      return Music.convertMusicToRNTPTrack(music, music.streamingLink);
    }
    const api = SessionStorage.get<AbstractStreamingService>(AbstractStreamingService.name)!;
    const [url, error] = await asyncFuncExecutor(() => api.getStreamURLAsync(music.videoId));
    if (!url) {
      throw new Error(error?.message || "Unable To Fetch Stream");
    }

    return Music.convertMusicToRNTPTrack(music, url);
  }

  /** Play Music */
  async playMusicAsync(music: Music, queueList: Music[] = []) {
    await this.resetAsync();
    this.addMusicsToQueue(queueList);
    const track = await this.getRNTPTrackFromMusicAsync(music);
    await TrackPlayer.add([track]);
    await TrackPlayer.play();
  }
}

export default new VirtualMusicPlayerService();
