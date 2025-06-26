import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Text, useTheme } from "react-native-paper";
import PlayerController from "./PlayerController";

export type TPlayerControllerBottomSheetRef = {
  showSheet(): void;
  hideSheet(): void;
};

function PlayerControllerBottomSheet({}: {}, ref: ForwardedRef<TPlayerControllerBottomSheetRef>) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const theme = useTheme();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleHideModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        onPress={handleHideModalPress}
        animatedIndex={{
          value: 1,
        }}
      />
    ),
    []
  );

  useImperativeHandle(ref, () => {
    return {
      showSheet: handlePresentModalPress,
      hideSheet: handleHideModalPress,
    };
  });

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        onDismiss={() => handleHideModalPress()}
        enableDismissOnClose
        enableDynamicSizing
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
        backgroundStyle={{ borderRadius: 40 }}
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 30 }}>
          <PlayerController />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default forwardRef(PlayerControllerBottomSheet);
