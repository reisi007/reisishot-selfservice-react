import { useTranslation } from 'react-i18next';
import { LoginDataProps } from '../../utils/LoginData';
import { FolderInformation, useFolderNames } from './choose-image.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ChooseImageAdmin } from './ChooseImageAdmin';

export function ChooseImage({ loginData }: LoginDataProps) {
  const { t } = useTranslation();
  const {
    loading,
    data,
    error,
  } = useFolderNames(loginData);
  return (
    <div className="container flex flex-col p-4">
      <h1 className="pt-2 pb-4 text-4xl">{t('admin.choose_images.title')}</h1>
      <Loadable<Array<FolderInformation>, unknown, unknown> loading={loading} data={data} error={error} loadingElement={<LoadingIndicator />}>
        {(response) => <ChooseImageAdmin data={response} loginData={loginData} />}
      </Loadable>
    </div>
  );
}
