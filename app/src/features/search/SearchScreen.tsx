import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";
import { ILike } from "typeorm/browser";
import { Database } from "~/database";
import { SearchEntity } from "~/database/entities";
import { useDebounce } from "~/hooks";
import { asyncFuncExecutor } from "~/core/utils";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";
import { HostedBackendApi } from "~/api";
import { SafeAreaView } from "react-native-safe-area-context";
import SessionStorage from "~/core/utils/SessionStorage";
import { AbstractBackendApi } from "~/abstracts";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchScreen">;

export default function SearchScreen({ navigation }: TProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ suggestion: string; id: number | string }[]>([]);

  const debouncedQuery = useDebounce(query);

  const theme = useTheme();

  async function getRecentSearchesFromDatabaseAsync(search: string = "") {
    const repo = Database.datasource.getRepository(SearchEntity);

    const queryOptions: Record<string, object> = {
      order: {
        createdAt: "DESC",
      },
    };

    if (search) {
      queryOptions["where"] = { query: ILike(`%${search}%`) };
    }

    return await repo.find(queryOptions);
  }

  async function getSuggestionsFromApiAsync(query: string) {
    const [suggestions] = await asyncFuncExecutor(() => HostedBackendApi.getSearchSuggestionsAsync(query));
    if (suggestions) {
      return suggestions.map((it) => ({ id: it, suggestion: it }));
    }
    return [];
  }

  async function removeSearchSuggestionFromDatabaseAsync(id: number) {
    const repo = Database.datasource.getRepository(SearchEntity);
    await repo.delete({ id });
  }

  async function addSearchSuggestionToDatabaseAsync(text: string) {
    const repo = Database.datasource.getRepository(SearchEntity);
    const suggestion = new SearchEntity();
    suggestion.query = text;
    await repo.save(suggestion);
  }

  async function bootStrapAsync() {
    if (debouncedQuery.length < 3) {
      getRecentSearchesFromDatabaseAsync().then((data) => {
        setSuggestions(data.map((it) => ({ suggestion: it.query, id: it.id })));
      });
    } else {
      getSuggestionsFromApiAsync(debouncedQuery).then(setSuggestions);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      bootStrapAsync();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    bootStrapAsync();
  }, [debouncedQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        value={query}
        onChangeText={setQuery}
        placeholder="Seach Songs"
        autoFocus
        autoCorrect={false}
        onSubmitEditing={() => {
          navigation.push("SearchResultsScreen", { query });
          addSearchSuggestionToDatabaseAsync(query);
        }}
      />
      <Animated.FlatList
        layout={LinearTransition}
        data={suggestions}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
        renderItem={({ item }) => {
          /**
           * We're storing number and string both for ids. So If it's number then
           * it comes from db else it's from api
           */
          const isRecentQuery = typeof item.id === "number";

          return (
            <View style={{ borderRadius: 10, overflow: "hidden" }}>
              <Pressable
                style={{
                  padding: 6,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                android_ripple={{ color: theme.colors.primary }}
                onLongPress={async () => {
                  if (isRecentQuery && typeof item.id === "number") {
                    await removeSearchSuggestionFromDatabaseAsync(item.id);
                    await bootStrapAsync();
                  }
                }}
                onPress={() => navigation.push("SearchResultsScreen", { query: item.suggestion })}
              >
                {/* Left section */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexShrink: 1,
                  }}
                >
                  <MaterialDesignIcons
                    color={theme.colors.onBackground}
                    name="magnify"
                    size={20}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    variant="titleMedium"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ flexShrink: 1 }}
                  >
                    {item.suggestion}
                  </Text>
                </View>

                {/* Right icon */}
                <MaterialDesignIcons
                  color={theme.colors.onBackground}
                  name="arrow-top-left"
                  size={20}
                  onPress={() => setQuery(item.suggestion)}
                />
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  suggestionContainer: {
    padding: 6,
  },
});
