import { Fragment, useEffect, useState } from "react";
import { ScrollView, ToastAndroid, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SkeletonLoader, useLoadingDialog } from "~/core/components";
import { VirtualMusicPlayerService } from "~/services";
import { MusicListItem } from "~/features/__shared__/components";
import { Music } from "~/models";
import RecentsRepository from "~/repositories/RecentsRepository";
import { SongEntity } from "~/database/entities";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeBottomTabNavigationProp } from "@bottom-tabs/react-navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";

type TNavigation = CompositeNavigationProp<
  NativeBottomTabNavigationProp<TBottomTabRoutes, "HomeScreen">,
  NativeStackNavigationProp<TStackNavigationRoutes>
>;

export default function RecentSongsList() {
  const [recentMusics, setRecentMusics] = useState<SongEntity[] | undefined>(undefined);
  const theme = useTheme();
  const loadingDialog = useLoadingDialog();
  const navigation = useNavigation<TNavigation>();

  async function handleMusicPressAsync(music: Music) {
    try {
      loadingDialog.show("Fetching Streams");
      VirtualMusicPlayerService.setQueueType("NORMAL");
      await VirtualMusicPlayerService.playMusicAsync(music);
      navigation.push("PlayerControllerScreen");
    } catch (error) {
      ToastAndroid.show((error as Error).message, ToastAndroid.SHORT);
    } finally {
      loadingDialog.dismiss();
    }
  }

  useEffect(() => {
    RecentsRepository.getLimitedMusicsAsync(0, 3)
      .then((data) => {
        setRecentMusics(data ?? []);
      })
      .catch(() => {
        setRecentMusics([]);
      });
  }, []);

  return (
    <View style={{ gap: 16 }}>
      {recentMusics && recentMusics.length > 0 && (
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
          Recents
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 30 }}
      >
        {recentMusics === undefined && (
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

        {recentMusics?.map((it, index) => {
          return (
            <View
              key={it.id.toString()}
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 40,
                overflow: "hidden",
                flexWrap: "wrap",
                width: 300,
              }}
            >
              <MusicListItem
                onPress={handleMusicPressAsync}
                music={Music.convertFromSongEntity(it)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
