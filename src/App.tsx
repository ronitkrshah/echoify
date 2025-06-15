import { MaterialYouTheme } from "./theme";
import { AppNavigation } from "./navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LoadingDialogProvider } from "./core/components";
import { useEffect } from "react";
import { LocalStorage } from "./utils";
import { PersistanceKeys } from "./constants";
import { PipedApi } from "./api";

export default function App() {
  useEffect(() => {
    const instanceUrl = LocalStorage.getItem(PersistanceKeys.PIPED_INSTANCE);
    if (instanceUrl) {
      PipedApi.setPipedApiUrl(instanceUrl);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <MaterialYouTheme>
        <LoadingDialogProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigation />
          </SafeAreaView>
        </LoadingDialogProvider>
      </MaterialYouTheme>
    </SafeAreaProvider>
  );
}
