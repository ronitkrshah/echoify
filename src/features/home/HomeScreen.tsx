import { Fragment, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "HomeScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function HomeScreen({ navigation }: TProps) {
  const theme = useTheme();

  async function bootStrapAsync() {}

  useEffect(() => {
    bootStrapAsync();
  }, []);

  return (
    <Fragment>
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
      </View>
      <FAB
        icon={"disc-player"}
        style={styles.fab}
        onPress={() => {
          navigation.push("PlayerControllerScreen");
        }}
      />
    </Fragment>
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
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
