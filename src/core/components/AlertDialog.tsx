import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  createContext,
  useContext,
  ReactNode,
  PropsWithChildren,
} from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type TAlertDialogController = {
  show: (options: {
    title?: string;
    description?: string;
    confirmText?: string;
    onConfirm?: () => void;
  }) => void;
  hide: () => void;
};

const AlertDialogContext = createContext<TAlertDialogController>({} as TAlertDialogController);

export function useAlertDialog(): TAlertDialogController {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialogContext must be used within an AlertDialogProvider");
  }
  return context;
}

const AlertDialog = forwardRef<TAlertDialogController>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("OK");
  const confirmCallback = useRef<() => void | null>(null);

  useImperativeHandle(ref, () => ({
    show: ({ title, description, confirmText = "OK", onConfirm }) => {
      setTitle(title ?? "");
      setDescription(description ?? "");
      setConfirmText(confirmText);
      confirmCallback.current = onConfirm ?? (() => {});
      setOpen(true);
    },
    hide: () => {
      setOpen(false);
    },
  }));

  const handleConfirm = () => {
    confirmCallback.current?.();
    setOpen(false);
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={() => setOpen(false)}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{description}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleConfirm}>{confirmText}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
});

export default function AlertDialogProvider({ children }: Required<PropsWithChildren>) {
  const dialogRef = useRef<TAlertDialogController>(null);

  const show = (options: {
    title?: string;
    description?: string;
    confirmText?: string;
    onConfirm?: () => void;
  }) => dialogRef.current?.show(options);

  const hide = () => dialogRef.current?.hide();

  return (
    <AlertDialogContext.Provider value={{ show, hide }}>
      {children}
      <AlertDialog ref={dialogRef} />
    </AlertDialogContext.Provider>
  );
}
