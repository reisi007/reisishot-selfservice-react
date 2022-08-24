import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { LoginData } from '../../utils/LoginData';
import { useChooseImagePreviewMetadata } from '../private/selfservice/choose-image/ChooseImage.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ChooseImageMetadata } from '../../admin/choose-image/choose-image.api';
import { Card } from '../../components/Card';
import { HOST } from '../../env';
import { ReviewImageForm } from './ReviewImageForm';
import { StoredReviewData, useStoredReviewData } from './reviewimage.api';

export function ReviewImages({ loginData }: { loginData: LoginData }) {
  const { folder } = useParams<'folder'>();

  if (folder === undefined) {
    return <Navigate to="/.." />;
  }
  return <ReviewPageContent loginData={loginData} folder={folder} />;
}

function ReviewPageContent({
  loginData,
  folder,
}: { loginData: LoginData, folder: string }) {
  const {
    data: previewData,
    loading: previewLoading,
    error,
  } = useChooseImagePreviewMetadata(loginData, folder);
  const {
    data: existingData,
    loading: existingLoading,
  } = useStoredReviewData(loginData, folder);
  const loading = previewLoading || existingLoading;
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('waitlist.titles.selfservice.tabs.choose_image.title')}</h1>
      <Loadable data={previewData} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(response) => (
          <div className="grid lg:grid-cols-2 xxl:grid-cols-3">
            {response.map((e, idx) => (
              <ReviewPageImage
                loginData={loginData}
                metadata={e}
                existingData={existingData ?? ({
                  ratings: {},
                  comments: {},
                })}
                idx={idx}
                key={e.filename}
                folder={folder}
              />
            ))}
          </div>
        )}
      </Loadable>
    </>
  );
}

function ReviewPageImage({
  metadata,
  existingData,
  loginData,
  folder,
  idx: number,
}: { metadata: ChooseImageMetadata, existingData: StoredReviewData, loginData: LoginData, folder: string, idx: number }) {
  const {
    filename,
    width,
    height,
  } = metadata;
  const { t } = useTranslation();
  const {
    user,
    auth,
  } = loginData;
  const filenameWithoutExtension = useMemo(() => filename.substring(0, filename.lastIndexOf('.')), [filename]);
  const lowercaseFilename = filename.toLowerCase();
  return (
    <Card className="m-2">
      <h2 className="mb-2">
        {t('waitlist.titles.selfservice.tabs.choose_image.image_title', {
          filename: filenameWithoutExtension,
          number,
        })}
      </h2>
      <div className="grow m-2 max-h-max">
        <img
          className="inline-block object-scale-down h-full align-middle"
          loading="lazy"
          width={width}
          height={height}
          key={filenameWithoutExtension}
          src={`${HOST}/api/choose_pictures_file_get.php?email=${user}&accesskey=${auth}&folder=${folder}&file=${filename}`}
          alt={filenameWithoutExtension}
        />
      </div>
      <ReviewImageForm
        loginData={loginData}
        folder={folder}
        image={filename}
        initialValues={{
          stars: existingData.ratings[lowercaseFilename],
          comment: existingData.comments[lowercaseFilename],
        }}
      />
    </Card>
  );
}
