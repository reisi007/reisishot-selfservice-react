import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { object as validateObject } from 'yup';
import { LoginData } from '../../utils/LoginData';
import { useChooseImagePreviewMetadata } from '../private/selfservice/choose-image/ChooseImage.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { ChooseImageMetadata } from '../../admin/choose-image/choose-image.api';
import { Card } from '../../components/Card';
import { HOST } from '../../env';
import { Form5StarRating, FormTextArea } from '../../form/FormikFields';
import { SubmitButton } from '../../components/SubmitButton';
import { requiredString } from '../../yupHelper';

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
    data,
    loading,
    error,
  } = useChooseImagePreviewMetadata(loginData, folder);
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('waitlist.titles.selfservice.tabs.choose_image.title')}</h1>
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(response) => (
          <div className="grid lg:grid-cols-2 xxl:grid-cols-3">
            {response.map((e, idx) => <ReviewPageImage loginData={loginData} metadata={e} idx={idx} key={e.filename} folder={folder} />)}
          </div>
        )}
      </Loadable>
    </>
  );
}

function ReviewPageImage({
  metadata,
  loginData,
  folder,
  idx: number,
}: { metadata: ChooseImageMetadata, loginData: LoginData, folder: string, idx: number }) {
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
          width={width}
          height={height}
          key={filenameWithoutExtension}
          src={`${HOST}/api/choose_pictures_file_get.php?email=${user}&accesskey=${auth}&folder=${folder}&file=${filename}`}
          alt={filenameWithoutExtension}
        />
      </div>
      <div>
        <Stars loginData={loginData} folder={folder} />
        <Comment loginData={loginData} folder={folder} />
      </div>
    </Card>
  );
}

function Stars({
  loginData,
  folder,
}: { loginData: LoginData, folder: string }) {
  const unusedOnSubmit = useCallback(() => {
  }, []);
  console.log('Unused:', loginData, folder);
  return (
    <Formik
      initialValues={{ value: undefined }}
      onSubmit={unusedOnSubmit}
    >
      {(_) => <Form5StarRating starSize="rs-3xl" name="value" />}
    </Formik>
  );
}

function Comment({
  loginData,
  folder,
}: { loginData: LoginData, folder: string }) {
  const unusedOnSubmit = useCallback(() => {
  }, []);
  console.log('Unused:', loginData, folder);
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{ value: undefined }}
      onSubmit={unusedOnSubmit}
      validationSchema={validateObject({
        value: requiredString()
          .min(3, t('form.errors.required')),
      })}
    >
      {(formik) => (
        <>
          <h3>{t('waitlist.titles.selfservice.tabs.choose_image.comment.title')}</h3>
          <FormTextArea className="my-2" name="value" cols={5} />
          <SubmitButton formik={formik} loading={false} error={null}>{t('waitlist.titles.selfservice.tabs.choose_image.comment.submit')}</SubmitButton>
        </>
      )}
    </Formik>
  );
}
