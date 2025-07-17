import { Fragment, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { IconButton, Surface, Text, useTheme } from "react-native-paper";
import TrackPlayer, {
  Event,
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from "react-native-track-player";
import { musicDurationFormatter } from "~/core/utils";
import Slider from "@react-native-community/slider";
import { SharedPlaylistModule } from "../playlist";
import { Music } from "~/models";

const _dimensions = Dimensions.get("screen");

export default function PlayerControllerScreen() {
  const [showPlaylistAddDialog, setShowPlaylistAddDialog] = useState(false);
  const activeTrack = useActiveTrack();
  const player = useIsPlaying();
  const theme = useTheme();

  useEffect(() => {
    const progressSubscription = TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      (e) => {
        console.log(e);
      }
    );

    return () => {
      progressSubscription.remove();
    };
  }, []);

  return (
    <Fragment>
      <View style={{ ...styles.container, backgroundColor: theme.colors.elevation.level3 }}>
        <View
          style={{
            ...styles.coverArtContainer,
            borderColor: theme.colors.elevation.level1,
          }}
        >
          <Image source={{ uri: activeTrack?.artwork }} style={StyleSheet.absoluteFillObject} />
        </View>

        <Surface style={{ borderRadius: 40, padding: 32, width: "100%", alignItems: "center" }}>
          <View style={{ gap: 12 }}>
            <Text
              numberOfLines={1}
              variant="titleLarge"
              style={{
                fontWeight: "bold",
                color: theme.dark ? theme.colors.onPrimary : theme.colors.primary,
                textAlign: "center",
              }}
            >
              {activeTrack?.title ?? "No Active Tracks"}
            </Text>
            <Text
              numberOfLines={1}
              variant="titleSmall"
              style={{
                fontWeight: "bold",
                color: theme.colors.onSurfaceDisabled,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {activeTrack?.artist ?? "Unknown Artist"}
            </Text>
          </View>
          <PlaybackSlider />
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon={"playlist-plus"}
              onPress={() => {
                setShowPlaylistAddDialog(true);
              }}
            />
            <IconButton icon={"skip-previous"} onPress={() => TrackPlayer.skipToPrevious()} />
            <IconButton
              disabled={player.bufferingDuringPlay}
              loading={player.bufferingDuringPlay}
              onPress={async () => {
                if (player.playing) {
                  TrackPlayer.pause();
                } else {
                  TrackPlayer.play();
                }
              }}
              animated
              icon={player.playing ? "pause" : "play"}
            />
            <IconButton icon={"skip-next"} onPress={() => TrackPlayer.skipToNext()} />
            <IconButton icon={"stop"} onPress={() => TrackPlayer.stop()} />
          </View>
        </Surface>
      </View>
      {activeTrack && (
        <SharedPlaylistModule.AddMusicToPlaylistDialog
          visible={showPlaylistAddDialog}
          onDimiss={() => {
            setShowPlaylistAddDialog(false);
          }}
          music={Music.convertFromRNTPTrack(activeTrack)}
        />
      )}
    </Fragment>
  );
}

function PlaybackSlider() {
  const theme = useTheme();
  const progress = useProgress(1000);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ color: theme.dark ? theme.colors.onPrimary : theme.colors.primary }}>
        {musicDurationFormatter(progress.position)}
      </Text>
      <Slider
        onSlidingComplete={(val) => {
          TrackPlayer.seekTo(val);
        }}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position}
        thumbTintColor={theme.dark ? theme.colors.onPrimary : theme.colors.primary}
        maximumTrackTintColor={theme.dark ? theme.colors.primaryContainer : theme.colors.tertiary}
        minimumTrackTintColor={theme.dark ? theme.colors.onPrimary : theme.colors.primary}
        style={{ flex: 1, height: 60 }}
      />
      <Text style={{ color: theme.dark ? theme.colors.onPrimary : theme.colors.primary }}>
        {musicDurationFormatter(progress.duration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  coverArtContainer: {
    width: _dimensions.width * 0.8,
    aspectRatio: 1,
    borderRadius: 80,
    overflow: "hidden",
    borderWidth: 8,
    elevation: 3,
  },
});
