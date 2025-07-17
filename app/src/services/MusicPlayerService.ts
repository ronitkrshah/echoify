import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RatingType,
} from "react-native-track-player";
import VirtualMusicPlayerService from "./VirtualMusicPlayerService";
import { ToastAndroid } from "react-native";

class MusicPlayerService {
  private _isInitialized = false;
  private _isTrackPlayerReady = false;

  public async initializePlayerEvents() {
    if (this._isInitialized) return;
    this._isInitialized = true;
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemoteSeek, (val) => TrackPlayer.seekTo(val.position));
    TrackPlayer.addEventListener(Event.RemoteStop, () => VirtualMusicPlayerService.resetAsync());
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (e) =>
      VirtualMusicPlayerService.handlePlayBackActiveTrackChangeEventAsync(e)
    );
    TrackPlayer.addEventListener(Event.PlaybackError, (e) => {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    });
  }

  public async setupTrackPlayer() {
    if (this._isTrackPlayerReady) return;
    this._isTrackPlayerReady = true;
    await TrackPlayer.setupPlayer();
    try {
      await TrackPlayer.updateOptions({
        ratingType: RatingType.Heart,
        progressUpdateEventInterval: 1000,
        android: {
          alwaysPauseOnInterruption: true,
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
      });
    } catch (error) {}
  }
}

/** Exporting a singleton instance */
export default new MusicPlayerService();
