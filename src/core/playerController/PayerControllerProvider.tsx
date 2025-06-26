import React, { PropsWithChildren, useContext, useRef } from "react";
import PlayerControllerBottomSheet, {
  TPlayerControllerBottomSheetRef,
} from "./PlayerControllerBottomSheet";

type TPlayerModalController = {
  showModal(): void;
  hideModal(): void;
};

const PlayerModalContext = React.createContext({} as TPlayerModalController);

export function usePlayerController() {
  return useContext(PlayerModalContext);
}

export default function PlayerControllerProvider({ children }: PropsWithChildren) {
  const modalref = useRef<TPlayerControllerBottomSheetRef>(null);

  return (
    <PlayerModalContext.Provider
      value={{
        showModal() {
          modalref.current?.showSheet();
        },
        hideModal() {
          modalref.current?.hideSheet();
        },
      }}
    >
      {children}
      <PlayerControllerBottomSheet ref={modalref} />
    </PlayerModalContext.Provider>
  );
}
