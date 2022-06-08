import React, {
  Dispatch, ReactNode, SetStateAction, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../admin/waitlist/ActionButton';

type Props = { children: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, };
type ModalProps = Props & { setVisible: Dispatch<SetStateAction<boolean>>, title: string };

function Modal({
  children,
  setVisible,
  title,
}: ModalProps) {
  const { t } = useTranslation();
  return (
    <div
      role="dialog"
      onClick={() => setVisible(false)}
      className="fixed top-0 left-0 z-40 w-full h-full bg-black/50"
    >
      <dialog
        onClick={(e) => e.stopPropagation()}
        className="block top-[10%] left-1/2 z-50 w-full rounded-lg shadow-lg -translate-x-1/2 sm:top-1/4 sm:w-3/4  md:w-1/2"
      >
        <h2 className="mb-2">{title}</h2>
        <div className="overflow-x-hidden overflow-y-auto max-h-[66.67vh]">
          {children(setVisible)}
        </div>
        <ActionButton className="mt-4 w-full text-white bg-reisishot" onClick={() => setVisible(false)}>{t('actions.close')}</ActionButton>
      </dialog>
    </div>
  );
}

export function useModal(title: string, children?: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, initialVisibility: boolean = false) {
  const [isVisible, setVisible] = useState(initialVisibility);
  const modal: ReactNode = isVisible && (
  <Modal title={title} setVisible={setVisible}>
    {(setVisibility) => children !== undefined && children(setVisibility)}
  </Modal>
  );
  return [modal, setVisible] as const;
}
