import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {
  CurrentPlayingMusicOverlay,
  Playlists,
  RecentSongsList,
  TrendingSongsList,
} from "./components";
import { Fragment } from "react";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "HomeScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function HomeScreen({ navigation }: TProps) {
  const theme = useTheme();

  return (
    <Fragment>
      <View style={{ flex: 1, gap: 20 }}>
        <Pressable
          style={[{ backgroundColor: theme.colors.primaryContainer }, styles.searchBar]}
          onPress={() => {
            navigation.push("SearchScreen");
          }}
        >
          <MaterialDesignIcons name="magnify" size={24} color={theme.colors.onBackground} />
          <Text variant="titleMedium">Search</Text>
        </Pressable>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, gap: 40, paddingBottom: 16 }}
        >
          <RecentSongsList />

          <TrendingSongsList />

          <Playlists query="Trending Songs" headerTitle="Trending" />
          <Playlists query="Romantic Songs New" headerTitle="Romantic" />
        </ScrollView>
      </View>
      <CurrentPlayingMusicOverlay />
    </Fragment>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
    marginHorizontal: 16,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
