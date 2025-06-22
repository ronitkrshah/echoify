import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SkeletonLoader } from "~/core/components";
import { Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Fragment, useEffect, useState } from "react";
import RecentsRepository from "~/repositories/RecentsRepository";
import { SongEntity } from "~/database/entities";
import { useQueries, useQuery } from "@tanstack/react-query";
import Animated, { FadeIn } from "react-native-reanimated";
import { MusicListItem } from "../__shared__/components";
import { Music } from "~/models";
import { sleepThreadAsync } from "~/core/utils";
import { RecentSongsList } from "./components";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "HomeScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function HomeScreen({ navigation }: TProps) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, gap: 20 }}>
      <Pressable
        style={[{ backgroundColor: theme.colors.primaryContainer }, styles.searchBar]}
        onPress={() => {
          navigation.push("SearchScreen");
        }}
      >
        <MaterialDesignIcons name="magnify" size={24} />
        <Text variant="titleMedium">Search</Text>
      </Pressable>

      <RecentSongsList />

      <View>
        <ScrollView></ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
});
