import {
  createContext,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Dialog, Text } from "react-native-paper";

export type TLoadingDialogController = {
  show(message?: string): void;
  updateMessage(messgae: string): void;
  dismiss(): void;
};

const LoadingDialogContext = createContext<TLoadingDialogController>(
  {} as TLoadingDialogController
);

function LoadingDialog(props: object, ref: ForwardedRef<TLoadingDialogController>) {
  const [visibe, setVisible] = useState(false);
  const [infoText, setInfoText] = useState<string>();

  useImperativeHandle(ref, () => {
    return {
      show(message) {
        setInfoText(message || "Loading...");
        setVisible(true);
      },
      updateMessage(messgae) {
        setInfoText(messgae);
      },
      dismiss() {
        setVisible(false);
        setInfoText(undefined);
      },
    };
  });

  return (
    <Dialog visible={visibe} dismissable={false} dismissableBackButton={false}>
      <Dialog.Content
        style={{
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={visibe} size={"large"} />
        <Text variant="titleMedium">{infoText}</Text>
      </Dialog.Content>
    </Dialog>
  );
}

const ForwardedLoadingDialog = forwardRef(LoadingDialog);

export default function LoadingDialogProvider({ children }: Required<PropsWithChildren>) {
  const ref = useRef<TLoadingDialogController>(null);

  return (
    <LoadingDialogContext.Provider
      value={{
        dismiss() {
          ref.current?.dismiss();
        },
        show(message) {
          ref.current?.show(message);
        },
        updateMessage(message) {
          ref.current?.updateMessage(message);
        },
      }}
    >
      {children}
      <ForwardedLoadingDialog ref={ref} />
    </LoadingDialogContext.Provider>
  );
}

export function useLoadingDialog() {
  return useContext(LoadingDialogContext);
}
