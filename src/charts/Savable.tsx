import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DomToImage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { StyledButton } from '../components/StyledButton';

type Props = { children: JSX.Element };

export function Savable({ children }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  return (
    <>
      <div className="box-content py-2 px-4" ref={divRef}>
        {children}
      </div>
      <div>
        <StyledButton
          onClick={() => {
            const cur = divRef.current;
            if (cur) {
              DomToImage.toBlob(cur, { bgcolor: 'white' }).then((r) => saveAs(r));
            }
          }}
          className="block p-2 mx-auto mt-2 rounded-lg border border-reisishot"
        >
          {t('utils.saveImg')}
        </StyledButton>
      </div>
    </>
  );
}
