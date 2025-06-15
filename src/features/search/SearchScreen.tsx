import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { PipedApi } from "~/api";
import { useDebounce } from "~/hooks";
import { TStackNavigationRoutes } from "~/navigation";

const APressable = Animated.createAnimatedComponent(Pressable);

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "SearchScreen">;

export default function SearchScreen({ navigation }: TProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query);
  const theme = useTheme();

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      PipedApi.getSearchSuggestionsAsync(debouncedQuery)
        .then(setSuggestions)
        .catch(() => {
          // Ignore
        });
    } else if (debouncedQuery.length === 0) {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  return (
    <View style={styles.container}>
      <Searchbar
        value={query}
        onChangeText={setQuery}
        placeholder="Search"
        autoFocus
        onSubmitEditing={() => {
          navigation.push("SearchResultsScreen", { query });
        }}
      />
      <Animated.ScrollView layout={LinearTransition}>
        {suggestions.map((it, index) => {
          return (
            <APressable
              onPress={() => navigation.push("SearchResultsScreen", { query: it })}
              entering={FadeIn.delay(index * 100)}
              key={index.toString()}
              style={styles.suggestionBox}
              android_ripple={{ color: theme.colors.primary }}
            >
              <Text numberOfLines={1} variant="titleMedium">
                {it}
              </Text>
            </APressable>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  suggestionBox: {
    padding: 16,
  },
});
