import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RatingType,
  Track,
} from "react-native-track-player";
import { InnertubeApi } from "~/api";
import { Music } from "~/models";
import { asyncFuncExecutor } from "~/utils";

class MusicPlayerService {
  private _isTrackPlayerReady = false;

  constructor() {
    this.setupTrackPlayer();
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

      this._isTrackPlayerReady = true;
    }
  }
}

/** Exporting a singleton instance */
export default new MusicPlayerService();
