import Slider from "@react-native-community/slider";
import moment from "moment";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { IconButton, Surface, Text, useTheme } from "react-native-paper";
import Animated from "react-native-reanimated";
import TrackPlayer, { useActiveTrack, useIsPlaying, useProgress } from "react-native-track-player";
import { SharedPlaylistModule } from "~/features/playlist";
import { Music } from "~/models";

export default function PlayerController() {
  const [showPlaylistAddDialog, setShowPlaylistAddDialog] = useState(false);
  const { duration, position } = useProgress(1000);
  const { bufferingDuringPlay, playing } = useIsPlaying();
  const activeTrack = useActiveTrack();
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Surface
        style={[
          styles.surface,
          {
            backgroundColor: theme.dark ? theme.colors.primary : theme.colors.primaryContainer,
            width: "98%",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          },
        ]}
      >
        <View
          style={{
            width: "90%",
            aspectRatio: 1,
            borderRadius: 999,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {activeTrack ? (
            <Animated.Image
              source={{
                uri: activeTrack?.artwork,
              }}
              style={[StyleSheet.absoluteFillObject]}
            />
          ) : (
            <IconButton icon={"disc"} size={250} />
          )}
        </View>
        <View>
          <Text
            numberOfLines={2}
            variant="titleLarge"
            style={{
              fontWeight: "bold",
              color: theme.dark ? theme.colors.onPrimary : theme.colors.primary,
              textAlign: "center",
            }}
          >
            {activeTrack?.title ?? "No Active Tracks"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: theme.dark ? theme.colors.onPrimary : theme.colors.primary }}>
            {moment.utc(position * 1000).format("mm:ss")}
          </Text>
          <Slider
            onSlidingComplete={(val) => {
              TrackPlayer.seekTo(val);
            }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            thumbTintColor={theme.dark ? theme.colors.onPrimary : theme.colors.primary}
            maximumTrackTintColor={
              theme.dark ? theme.colors.primaryContainer : theme.colors.tertiary
            }
            minimumTrackTintColor={theme.dark ? theme.colors.onPrimary : theme.colors.primary}
            style={{ width: Dimensions.get("window").width * 0.6, height: 60 }}
          />
          <Text style={{ color: theme.dark ? theme.colors.onPrimary : theme.colors.primary }}>
            {moment.utc(duration * 1000).format("mm:ss")}
          </Text>
        </View>
      </Surface>

      <Surface style={[styles.surface, { backgroundColor: theme.colors.elevation.level5 }]}>
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon={"playlist-plus"}
            onPress={() => {
              setShowPlaylistAddDialog(true);
            }}
          />
          <IconButton icon={"skip-previous"} onPress={() => TrackPlayer.skipToPrevious()} />
          <IconButton
            disabled={bufferingDuringPlay}
            loading={bufferingDuringPlay}
            onPress={async () => {
              if (playing) {
                TrackPlayer.pause();
              } else {
                TrackPlayer.play();
              }
            }}
            animated
            icon={playing ? "pause" : "play"}
          />
          <IconButton icon={"skip-next"} onPress={() => TrackPlayer.skipToNext()} />
          <IconButton icon={"stop"} onPress={() => TrackPlayer.stop()} />
        </View>
      </Surface>
      {activeTrack && (
        <SharedPlaylistModule.AddMusicToPlaylistDialog
          visible={showPlaylistAddDialog}
          onDimiss={() => {
            setShowPlaylistAddDialog(false);
          }}
          music={Music.convertFromRNTPTrack(activeTrack)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 26,
  },
  surface: {
    borderRadius: 40,
    padding: 16,
  },
});
