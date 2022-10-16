import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useModal } from '../../components/Modal';
import { StyledButton } from '../../components/StyledButton';
import Markdown from '../../utils/markdown/Markdown';
import { useFetch } from '../../http';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { useNavigation } from '../../hooks/useNavigation';

export function PreviewContract() {
  const { t } = useTranslation();
  const [{ displayContract }] = useNavigation();
  const [previewContract, openContract] = useModal(t('waitlist.previewContract.title'), () => <DisplayPreviewContract />);

  useEffect(() => {
    if (displayContract === 'true') openContract(true);
  }, [displayContract, openContract]);

  return (
    <>
      {previewContract}
      <div className="flex flex-wrap justify-evenly items-center py-2 mx-auto md:w-1/2">
        <StyledButton className="text-white bg-reisishot" onClick={() => openContract(true)}>{t('waitlist.previewContract.button')}</StyledButton>
      </div>
    </>
  );
}

function DisplayPreviewContract() {
  const [{
    data,
    loading,
    error,
  }] = useContract('2022');
  return <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator height="2rem" />}>{(response) => <Markdown className="text-center" content={response} />}</Loadable>;
}

function useContract(name: string) {
  return useFetch<string>({
    url: `api/contract-template_get.php?filename=${name}.md`,
    headers: { 'Content-Type': 'text/plain' },
  });
}
