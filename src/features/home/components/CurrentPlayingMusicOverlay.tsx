import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useEffect } from "react";
import { NativeBottomTabNavigationProp } from "@bottom-tabs/react-navigation";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { usePlayerController } from "~/core/playerController";

type Navigation = CompositeNavigationProp<
  NativeBottomTabNavigationProp<TBottomTabRoutes, "HomeScreen">,
  NativeStackNavigationProp<TStackNavigationRoutes>
>;

export default function CurrentPlayingMusicOverlay() {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const theme = useTheme();
  const rotation = useSharedValue(0);
  const playerController = usePlayerController();

  const navigation = useNavigation<Navigation>();

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

  return (
    <Animated.View
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
        onPress={() => {
          playerController.showModal();
        }}
      >
        <View>
          <Animated.Image
            source={{ uri: activeTrack?.artwork }}
            height={60}
            width={60}
            resizeMode={"cover"}
            style={[{ borderRadius: 30 }, spinningStyle]}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text variant="labelLarge" numberOfLines={2}>
            {activeTrack?.title ?? "No Active Track"}
          </Text>
          <Text variant="labelSmall" style={{ fontStyle: "italic" }}>
            {activeTrack?.artist}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
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
    gap: 16,
  },
});
