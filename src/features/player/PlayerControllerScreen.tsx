import Slider from "@react-native-community/slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, ToastAndroid, View } from "react-native";
import { IconButton, Surface, Text, useTheme } from "react-native-paper";
import { useSharedValue, withTiming } from "react-native-reanimated";
import TrackPlayer, {
  Event,
  PlaybackState,
  State,
  Track,
  useProgress,
} from "react-native-track-player";
import { TStackNavigationRoutes } from "~/navigation";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "PlayerControllerScreen">;

export default function PlayerControllerScreen({ route }: TProps) {
  const [activeTrack, setActiveTrack] = useState<Track>();
  const [playbackState, setPlabackState] = useState<State>();
  const { duration, position } = useProgress(1000);

  const theme = useTheme();

  useEffect(() => {
    TrackPlayer.getActiveTrack().then((track) => {
      if (track) {
        setActiveTrack(track);
      }
    });

    const playbackStateSubscription = TrackPlayer.addEventListener(
      Event.PlaybackState,
      (playbackState) => {
        setPlabackState(playbackState.state);
      }
    );

    const trackChangeSubscription = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      (track) => {
        if (track.track) {
          setActiveTrack(track.track);
        } else if (track.lastTrack) {
          setActiveTrack(track.lastTrack);
        }
      }
    );

    const trackPlayErrorSubscription = TrackPlayer.addEventListener(
      Event.PlaybackError,
      (error) => {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    );

    return () => {
      playbackStateSubscription.remove();
      trackChangeSubscription.remove();
      trackPlayErrorSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Surface
        style={[
          styles.surface,
          {
            backgroundColor: theme.colors.primaryContainer,
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
            <Image
              source={{
                uri: activeTrack?.artwork,
              }}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            <IconButton icon={"disc"} size={250} />
          )}
        </View>
        <View>
          <Text
            numberOfLines={2}
            variant="titleLarge"
            style={{ fontWeight: "bold", color: theme.colors.primary, textAlign: "center" }}
          >
            {activeTrack?.title ?? "No Active Tracks"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>{moment.utc(position * 1000).format("mm:ss")}</Text>
          <Slider
            onSlidingComplete={(val) => {
              TrackPlayer.seekTo(val);
            }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            style={{ width: Dimensions.get("window").width * 0.6, height: 60 }}
          />
          <Text>{moment.utc(duration * 1000).format("mm:ss")}</Text>
        </View>
      </Surface>

      <Surface style={[styles.surface, { backgroundColor: theme.colors.primaryContainer }]}>
        <View style={{ flexDirection: "row" }}>
          <IconButton icon={"repeat"} />
          <IconButton icon={"skip-previous"} />
          <IconButton
            disabled={playbackState === State.Buffering}
            loading={playbackState === State.Buffering}
            onPress={async () => {
              if (playbackState) {
                TrackPlayer.pause();
              } else {
                TrackPlayer.play();
              }
            }}
            animated
            icon={playbackState === State.Playing ? "pause" : "play"}
          />
          <IconButton icon={"skip-next"} />
          <IconButton icon={"stop"} />
        </View>
      </Surface>
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
