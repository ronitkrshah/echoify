import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RatingType,
} from "react-native-track-player";

class PlayerService {
  private _isTrackPlayerReady = false;

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
}

/** Exporting a singleton instance */
const MusicPlayerService = new PlayerService();
export default MusicPlayerService;
