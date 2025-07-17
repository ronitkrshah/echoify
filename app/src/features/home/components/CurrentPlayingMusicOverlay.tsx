import Animated, {
  Easing,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useEffect } from "react";

type TProps = {
  onPress?(): void;
};

export default function CurrentPlayingMusicOverlay({ onPress }: TProps) {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const theme = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (playbackState.state === State.Playing) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 6000,
          easing: Easing.linear,
        }),
        Infinity,
        false
      );
    } else {
      rotation.value = withSpring(rotation.value);
    }
  }, [playbackState.state]);

  const spinningStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  if (!activeTrack) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOut.duration(400)}
      style={[
        {
          backgroundColor: theme.colors.secondaryContainer,
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
          overflow: "hidden",
        },
      ]}
    >
      <Pressable
        style={styles.container}
        android_ripple={{ color: theme.colors.primary }}
        onPress={onPress}
      >
        <View>
          <Animated.Image
            source={{ uri: activeTrack.artwork }}
            height={60}
            width={60}
            resizeMode={"cover"}
            style={[{ borderRadius: 30 }, spinningStyle]}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text variant="labelLarge" numberOfLines={2}>
            {activeTrack.title}
          </Text>
          {activeTrack.artist && (
            <Text variant="labelSmall" style={{ fontStyle: "italic" }}>
              {activeTrack.artist}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton icon={"skip-previous"} onPress={() => TrackPlayer.skipToPrevious()} />
          <IconButton
            icon={playbackState.state === State.Playing ? "pause" : "play"}
            onPress={() => {
              playbackState.state === State.Playing ? TrackPlayer.pause() : TrackPlayer.play();
            }}
          />
          <IconButton icon={"skip-next"} onPress={() => TrackPlayer.skipToNext()} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: "row",
    gap: 12,
  },
});
