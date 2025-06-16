import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RatingType,
  Track,
} from "react-native-track-player";

class MusicPlayerService {
  private _isTrackPlayerReady = false;
  private _queue: Track[] = [];

  get queueList() {
    return this._queue;
  }

  public async initializePlayerEvents() {
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  }

  public async setupTrackPlayer() {
    if (!this._isTrackPlayerReady) {
      await TrackPlayer.setupPlayer();
      try {
        await TrackPlayer.updateOptions({
          ratingType: RatingType.Heart,
          android: {
            alwaysPauseOnInterruption: true,
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
      } catch (error) {
        console.log(error);
      }

      this._isTrackPlayerReady = true;
    }
  }

  async isTrackPlayingAsync() {
    return (await TrackPlayer.getActiveTrack()) !== undefined;
  }

  async addTrackToQueueAsync(track: Track, index = -1) {
    this._queue.push(track);
  }
}

/** Exporting a singleton instance */
export default new MusicPlayerService();
