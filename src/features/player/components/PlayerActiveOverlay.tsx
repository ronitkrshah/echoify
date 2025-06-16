import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";

export default function PlayerActiveOverlay() {
  const rotation = useSharedValue(0);
  const theme = useTheme();

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const musicThumbnailRotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  return (
    <View style={{ backgroundColor: theme.colors.primaryContainer, height: 70 }}>
      <Pressable
        style={{ alignItems: "center", height: "100%", padding: 16, flexDirection: "row", gap: 16 }}
      >
        <Animated.Image
          source={{
            uri: "https://i.ytimg.com/vi/nCD2hj6zJEc/maxresdefault.jpg",
          }}
          height={60}
          width={60}
          style={[{ borderRadius: 30 }, musicThumbnailRotationStyle]}
        />

        <View style={{ flex: 1 }}>
          <Text>Dheere Dheere By Honey Singh</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <MaterialCommunityIcons name="skip-previous-outline" size={24} />
          <MaterialCommunityIcons name="play" size={24} />
          <MaterialCommunityIcons name="skip-next-outline" size={24} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
  },
});
