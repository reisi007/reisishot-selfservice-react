import React, {
  Dispatch, ReactNode, SetStateAction, useState,
} from 'react';
import classNames from 'classnames';

type Props = { children: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, };
type ModalProps = Props & { isVisible: boolean, setVisible: Dispatch<SetStateAction<boolean>> };

function Modal({
  children,
  isVisible,
  setVisible,
}: ModalProps) {
  const classes = classNames({
    hidden: !isVisible,
  });

  return (
    <div
      role="dialog"
      onClick={() => setVisible(false)}
      className={`fixed z-40 top-0 left-0 w-full h-full bg-black/50 ${classes}`}
    >
      <dialog
        onClick={(e) => e.stopPropagation()}
        className="block top-1/4 left-1/2 z-50 w-3/4 rounded-lg  shadow-lg -translate-x-1/2 -translate-y-1/4 lg:w-1/2"
      >
        {children(setVisible)}
      </dialog>
    </div>
  );
}

export function useModal(children: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, initialVisibility: boolean = false) {
  const [isVisible, setVisible] = useState(initialVisibility);
  const modal = <Modal isVisible={isVisible} setVisible={setVisible}>{(setVisibility) => children(setVisibility)}</Modal>;
  return [modal, setVisible] as const;
}
