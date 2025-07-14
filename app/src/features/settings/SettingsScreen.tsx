import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { List, Switch, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AbstractBackendApi } from "~/abstracts";
import { HostedBackendApi, InnertubeApi } from "~/api";
import { useAlertDialog, useLoadingDialog } from "~/core/components";
import { LocalStorage } from "~/core/utils";
import SessionStorage from "~/core/utils/SessionStorage";
import { TStackNavigationRoutes } from "~/navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "RecentsScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function SettingsScreen() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const theme = useTheme();
  const alertDialog = useAlertDialog();
  const busyModal = useLoadingDialog();

  function toggleSwitch() {
    if (isSwitchOn) {
      setIsSwitchOn(false);
      SessionStorage.set(AbstractBackendApi.name, HostedBackendApi);
      LocalStorage.setItem(AbstractBackendApi.name, HostedBackendApi.NAME);
    } else {
      alertDialog.show({
        title: "Activate Built-in Innertube Service",
        description:
          "Initial setup may take up to 1 minute; afterward, it typically completes in under 10 seconds. If YouTube Music is blocked in your region, it's recommended to keep this feature disabled.",
        confirmText: "ACTIVATE",
        async onConfirm() {
          try {
            busyModal.show("Setting Up Innertube Service");
            await InnertubeApi.setup();
            SessionStorage.set(AbstractBackendApi.name, InnertubeApi);
            LocalStorage.setItem(AbstractBackendApi.name, InnertubeApi.NAME);
            setIsSwitchOn(true);
          } catch (error) {
            ToastAndroid.show("Failed To Set Builtin Innertube Service", ToastAndroid.SHORT);
          } finally {
            busyModal.dismiss();
          }
        },
      });
    }
  }

  useEffect(() => {
    const api = SessionStorage.get<AbstractBackendApi>(AbstractBackendApi.name)!;
    setIsSwitchOn(api.NAME === InnertubeApi.NAME);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <List.Item
        title="Use builtin innertube service"
        description="Using builtin innertube service will increase data fetching speed and improve streaming with minimal or no buffering (depends on your internet). May slightly delay app startup, but overall performance remains smooth."
        descriptionNumberOfLines={6}
        titleStyle={{ fontSize: 22, color: theme.colors.primary, fontWeight: "bold" }}
        right={() => <Switch value={isSwitchOn} onValueChange={toggleSwitch} />}
      />
    </SafeAreaView>
  );
}
