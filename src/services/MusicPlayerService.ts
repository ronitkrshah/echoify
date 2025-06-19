import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RatingType,
} from "react-native-track-player";

class MusicPlayerService {
  private _isTrackPlayerReady = false;

  public async initializePlayerEvents() {
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemoteSeek, (val) => TrackPlayer.seekTo(val.position));
  }

  public async setupTrackPlayer() {
    if (this._isTrackPlayerReady) return;
    this._isTrackPlayerReady = true;
    await TrackPlayer.setupPlayer();
    try {
      await TrackPlayer.updateOptions({
        ratingType: RatingType.Heart,
        android: {
          alwaysPauseOnInterruption: true,
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
      });
    } catch (error) {}
  }
}

/** Exporting a singleton instance */
export default new MusicPlayerService();
