import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SkeletonLoader } from "~/core/components";
import { sleepThreadAsync } from "~/core/utils";
import { MusicListItem } from "~/features/__shared__/components";
import { Music } from "~/models";
import RecentsRepository from "~/repositories/RecentsRepository";

export default function RecentSongsList() {
  const recentMusics = useQuery({
    queryKey: ["recents"],
    queryFn: async () => {
      return (await RecentsRepository.getLimitedMusicsAsync(0, 3)) ?? [];
    },
  });
  const theme = useTheme();

  return (
    <View style={{ gap: 16 }}>
      {recentMusics.data && recentMusics.data.length > 0 && (
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
          Recents
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 30 }}
      >
        {recentMusics.isFetching && (
          <Fragment>
            <SkeletonLoader
              height={70}
              width={300}
              cornerRadius={40}
              colors={["transparent", theme.colors.inversePrimary, "transparent"]}
              primaryBackground={theme.colors.secondaryContainer}
            />
            <SkeletonLoader
              height={70}
              width={300}
              cornerRadius={40}
              colors={["transparent", theme.colors.inversePrimary, "transparent"]}
              primaryBackground={theme.colors.secondaryContainer}
            />
          </Fragment>
        )}

        {recentMusics.data?.map((it, index) => {
          return (
            <View
              key={it.id.toString()}
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 40,
                overflow: "hidden",
              }}
            >
              <MusicListItem music={Music.convertFromSongEntity(it)} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
