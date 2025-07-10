import { ColorValue, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";

type TSkeletonProps = {
  height: number;
  width: number;
  colors: [ColorValue, ColorValue, ...ColorValue[]];
  primaryBackground?: string;
  cornerRadius?: number;
  duration?: number;
};

const ALinerGradient = Animated.createAnimatedComponent(LinearGradient);

export default function SkeletonLoader({
  height,
  width,
  primaryBackground = "gray",
  cornerRadius = 0,
  duration = 4000,
  colors,
}: TSkeletonProps) {
  const position = useSharedValue(0);

  useEffect(() => {
    position.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);

    return () => {
      cancelAnimation(position);
    };
  }, []);

  const infiniteAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(position.value, [0, 1], [-width, width]),
        },
        { rotate: "90deg" },
      ],
    };
  });
  return (
    <View
      style={{
        height,
        width,
        backgroundColor: primaryBackground,
        borderRadius: cornerRadius,
        overflow: "hidden",
      }}
    >
      <ALinerGradient style={[{ width: height, height }, infiniteAnimationStyle]} colors={colors} />
    </View>
  );
}
