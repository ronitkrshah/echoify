import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp, DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

type TSkeletonLoaderProps = {
  visible?: boolean;
  width?: number | DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  highlightColor?: string;
  duration?: number;
};

function SkeletonLoader({
  visible = true,
  width = "100%",
  height = 20,
  borderRadius = 8,
  containerStyle,
  backgroundColor = "#e0e0e0",
  highlightColor = "#ffffff30",
  duration = 1000,
}: TSkeletonLoaderProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withTiming(1, {
              duration,
              easing: Easing.linear,
            }),
            -1,
            false,
          ),
        },
      ],
    };
  });

  if (!visible) return null;

  return (
    <View
      style={[
        {
          width,
          height,
          overflow: "hidden",
          borderRadius,
          backgroundColor,
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX: -200 }],
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[backgroundColor, highlightColor, backgroundColor]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export default SkeletonLoader;
