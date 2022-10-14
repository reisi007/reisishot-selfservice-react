import React, {
  Dispatch, ReactNode, SetStateAction, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ActionButton } from '../admin/waitlist/ActionButton';

type Props = { children: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, };
type ModalProps = Props & { setVisible: Dispatch<SetStateAction<boolean>>, title: string };

function Modal({
  children,
  setVisible,
  title,
}: ModalProps) {
  const { t } = useTranslation();

  const classes = classNames(
    'relative origin-center z-50 p-4 w-full bg-white rounded-lg shadow-lg top-1/2 -translate-y-1/2',
    'md:w-3/4 md:translate-x-[16.667%]',
    'xl:w-1/2 xl:translate-x-1/2',
  );
  return (
    <div
      role="dialog"
      onClick={() => setVisible(false)}
      className="fixed top-0 left-0 z-40 w-full h-full bg-black/50 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={classes}
      >
        <h2 className="mb-2">{title}</h2>
        <div className="overflow-x-hidden overflow-y-auto max-h-[66.67vh]">
          {children(setVisible)}
        </div>
        <ActionButton className="mt-4 w-full text-white bg-reisishot" onClick={() => setVisible(false)}>{t('actions.close')}</ActionButton>
      </div>
    </div>
  );
}

export function useModal(title: string, content?: (setVisible: Dispatch<SetStateAction<boolean>>) => ReactNode, initialVisibility: boolean = false) {
  const [isVisible, setVisible] = useState(initialVisibility);
  const modal: ReactNode = isVisible && (
    <Modal title={title} setVisible={setVisible}>
      {(setVisibility) => content !== undefined && content(setVisibility)}
    </Modal>
  );
  return [modal, setVisible] as const;
}
