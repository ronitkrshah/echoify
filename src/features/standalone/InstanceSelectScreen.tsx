import { ScrollView, StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, useTheme } from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useState } from "react";
import { asyncFuncExecutor, LocalStorage, sleepThreadAsync } from "~/utils";
import { PersistanceKeys } from "~/constants";
import { PipedApi } from "~/api";
import { useLoadingDialog } from "~/core/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TStackNavigationRoutes } from "~/navigation";

type TProps = NativeStackScreenProps<TStackNavigationRoutes, "InstanceSelectScreen">;

const _pipedPublicInstances = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.leptons.xyz",
  "https://pipedapi.nosebs.ru",
  "https://pipedapi-libre.kavin.rocks",
  "https://piped-api.privacy.com.de",
  "https://pipedapi.adminforge.de",
  "https://api.piped.yt",
  "https://pipedapi.drgns.space",
  "https://piapi.ggtyler.dev",
  "https://pipedapi.owo.si",
  "https://pipedapi.ducks.party",
  "https://piped-api.codespace.cz",
  "https://pipedapi.reallyaweso.me",
  "https://api.piped.private.coffee",
  "https://pipedapi.darkness.services",
  "https://pipedapi.orangenet.cc",
];

export default function InstanceSelectScreen({ navigation }: TProps) {
  const [selectedInstance, setSelectedInstance] = useState(_pipedPublicInstances[0]);
  const theme = useTheme();
  const loadingDialog = useLoadingDialog();

  async function handleSetInstanceAsync() {
    PipedApi.setPipedApiUrl(selectedInstance);
    LocalStorage.setItem(PersistanceKeys.PIPED_INSTANCE, selectedInstance);
    loadingDialog.show("Checking Instance Response...");

    const [data] = await asyncFuncExecutor(() =>
      PipedApi.searchWithQueryAsync("Rick Roll", "music_songs")
    );
    loadingDialog.dismiss();
    if (data) {
      navigation.replace("BottomTabNavigation", { screen: "HomeScreen" });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.serverIconContainer}>
        <MaterialDesignIcons name="server-outline" size={50} color={theme.colors.primary} />
        <Text variant="titleLarge">Select A Public Instance</Text>
      </View>

      <ScrollView>
        {_pipedPublicInstances.map((it) => (
          <RadioButton.Group
            key={it}
            onValueChange={(value) => setSelectedInstance(value)}
            value={selectedInstance}
          >
            <View
              style={{
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <RadioButton.Item rippleColor={theme.colors.primary} value={it} label={it} />
            </View>
          </RadioButton.Group>
        ))}
      </ScrollView>

      <View style={styles.btnContainer}>
        <Button mode="contained" onPress={handleSetInstanceAsync}>
          Set Instance
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  serverIconContainer: {
    alignItems: "center",
    gap: 16,
    marginTop: 32,
    marginBottom: 16,
  },
  btnContainer: {
    paddingVertical: 20,
  },
});
