import Animated, {
  cancelAnimation,
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
import { usePlayerController } from "~/core/playerController";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { VirtualMusicPlayerService } from "~/core/services";

export default function CurrentPlayingMusicOverlay() {
  const overlayYSharedValue = useSharedValue(0);
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const theme = useTheme();
  const rotation = useSharedValue(0);
  const playerController = usePlayerController();

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.y > 0) {
        overlayYSharedValue.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (overlayYSharedValue.value > 20) {
        VirtualMusicPlayerService.resetAsync();
      } else {
        overlayYSharedValue.value = withSpring(0);
      }
    })
    .runOnJS(true);

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

    return () => {
      cancelAnimation(rotation);
    };
  }, [playbackState.state]);

  const spinningStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const translateYStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: overlayYSharedValue.value }],
    };
  });

  if (!activeTrack) return null;

  return (
    <GestureDetector gesture={panGesture}>
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
          translateYStyle,
        ]}
      >
        <Pressable
          style={styles.container}
          android_ripple={{ color: theme.colors.primary }}
          onPress={() => {
            playerController.showModal();
          }}
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
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: "row",
    gap: 12,
  },
});
