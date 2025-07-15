import { NativeBottomTabNavigationProp } from "@bottom-tabs/react-navigation";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, { FadeInRight } from "react-native-reanimated";
import { HostedBackendApi } from "~/api";
import { SkeletonLoader } from "~/core/components";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";

type TProps = {
  query: string;
  headerTitle: string;
};
type Navigation = CompositeNavigationProp<
  NativeBottomTabNavigationProp<TBottomTabRoutes, "HomeScreen">,
  NativeStackNavigationProp<TStackNavigationRoutes>
>;

const _cardSize = 250;

export default function Playlists({ query, headerTitle }: TProps) {
  const playlistInfo = useQuery({
    queryKey: ["playlist_info", query],
    queryFn: async () => HostedBackendApi.serachPlaylistsAsync(query)
  });
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();

  return (
    <View>
      {playlistInfo.isFetching && (
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 16 }}
          showsHorizontalScrollIndicator={false}
        >
          {new Array(5).fill("0").map((it, index) => (
            <SkeletonLoader
              key={index.toString()}
              height={250}
              width={250}
              cornerRadius={40}
              colors={["transparent", theme.colors.inversePrimary, "transparent"]}
              primaryBackground={theme.colors.secondaryContainer}
            />
          ))}
        </ScrollView>
      )}

      {playlistInfo.data && !playlistInfo.isFetching && (
        <Fragment>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
            {headerTitle}
          </Text>

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={playlistInfo.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <Animated.View
                  entering={FadeInRight.delay(index * 100)}
                  style={{
                    width: _cardSize,
                    height: _cardSize,
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  <Pressable
                    style={{ flex: 1, gap: 7, paddingVertical: 16 }}
                    android_ripple={{ color: theme.colors.primary }}
                    onPress={() =>
                      navigation.push("YoutubePlaylistDetailsScreen", { playlistId: item.id })
                    }
                  >
                    <Image
                      source={{ uri: item.thumbnail }}
                      height={_cardSize - 60}
                      width={_cardSize - 60}
                      style={{ borderRadius: 20, marginHorizontal: "auto" }}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        color: theme.colors.primary,
                        fontWeight: "bold",
                        width: "80%",
                        marginHorizontal: "auto",
                      }}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            }}
          />
        </Fragment>
      )}
    </View>
  );
}
