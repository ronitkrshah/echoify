import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TSearchPlaylist } from "~/api";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "TrendingScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function TrendingScreen({ navigation }: TProps) {
  const [trendingVideos, setTrendingVideos] = useState<TSearchPlaylist[]>([]);

  const theme = useTheme();

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={[{ backgroundColor: theme.colors.elevation.level5 }, styles.searchBar]}
        onPress={() => {
          navigation.push("SearchScreen");
        }}
      >
        <MaterialDesignIcons name="magnify" size={24} />
        <Text variant="titleMedium">Search Songs...</Text>
      </Pressable>
      <ScrollView>
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <MaterialDesignIcons name="compass-outline" size={40} color={theme.colors.primary} />
            <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
              Trending
            </Text>
          </View>

          <FlatList
            horizontal
            data={trendingVideos}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.url}
            contentContainerStyle={{
              gap: 16,
              backgroundColor: theme.colors.inversePrimary,
              padding: 16,
              borderRadius: 32,
            }}
            renderItem={({ item }) => {
              return (
                <Pressable
                  style={[styles.playlistCard, { backgroundColor: theme.colors.elevation.level5 }]}
                >
                  <Image
                    source={{ uri: item.thumbnail }}
                    height={140}
                    width={150}
                    style={{ borderRadius: 20 }}
                  />
                  <View style={{ padding: 8 }}>
                    <Text variant="titleMedium" numberOfLines={2} style={{ textAlign: "center" }}>
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
  playlistCard: {
    width: 150,
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  searchBar: {
    borderRadius: 60,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
});
