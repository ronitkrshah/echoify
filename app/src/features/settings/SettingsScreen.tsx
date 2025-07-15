import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { List, Switch, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AbstractStreamingService } from "~/abstracts";
import { useAlertDialog, useLoadingDialog } from "~/core/components";
import { LocalStorage } from "~/core/utils";
import SessionStorage from "~/core/utils/SessionStorage";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { DefaultStreamingService, InnertubeStreamingService } from "~/services";

export default function SettingsScreen() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const theme = useTheme();
  const alertDialog = useAlertDialog();
  const busyModal = useLoadingDialog();

  function toggleSwitch() {
    if (isSwitchOn) {
      setIsSwitchOn(false);
      SessionStorage.set(AbstractStreamingService.name, DefaultStreamingService);
      LocalStorage.setItem(AbstractStreamingService.name, DefaultStreamingService.NAME);
    } else {
      alertDialog.show({
        title: "Powering Up Gawd Mode",
        description:
          "One-time setup may take a minute. After that, it’s turbo.\n\nIf YouTube Music is blocked in your area, don’t flex with this mode.",
        confirmText: "ENABLE",
        async onConfirm() {
          try {
            busyModal.show("Installing Skill Issue Fix...");
            await InnertubeStreamingService.setup();
            SessionStorage.set(AbstractStreamingService.name, InnertubeStreamingService);
            LocalStorage.setItem(AbstractStreamingService.name, InnertubeStreamingService.NAME);
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
    const api = SessionStorage.get<AbstractStreamingService>(AbstractStreamingService.name)!;
    setIsSwitchOn(api.NAME === InnertubeStreamingService.NAME);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <List.Item
        title="Gawd Mode"
        description="Slow streaming is for nub peoples. Switch to Gawd Mode"
        descriptionNumberOfLines={6}
        titleStyle={{ fontSize: 22, color: theme.colors.primary, fontWeight: "bold" }}
        right={() => <Switch value={isSwitchOn} onValueChange={toggleSwitch} />}
        left={() => <MaterialIcons name="skull-outline" size={24} color={theme.colors.primary} />}
        containerStyle={{ alignItems: "center" }}
      />
    </SafeAreaView>
  );
}
