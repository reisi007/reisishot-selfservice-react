import React, {
  Dispatch, ReactNode, SetStateAction, useState,
} from 'react';

type Props = { children: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, };
type ModalProps = Props & { setVisible: Dispatch<SetStateAction<boolean>> };

function Modal({
  children,
  setVisible,
}: ModalProps) {
  return (
    <div
      role="dialog"
      onClick={() => setVisible(false)}
      className="fixed top-0 left-0 z-40 w-full h-full bg-black/50"
    >
      <dialog
        onClick={(e) => e.stopPropagation()}
        className="block top-1/4 left-1/2 z-50 w-full rounded-lg shadow-lg -translate-x-1/2 sm:w-3/4  md:w-1/2"
      >
        {children(setVisible)}
      </dialog>
    </div>
  );
}

export function useModal(children: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, initialVisibility: boolean = false) {
  const [isVisible, setVisible] = useState(initialVisibility);
  const modal: ReactNode = isVisible && <Modal setVisible={setVisible}>{(setVisibility) => children(setVisibility)}</Modal>;
  return [modal, setVisible] as const;
}
