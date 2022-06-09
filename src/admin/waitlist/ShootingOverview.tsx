import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { FormikHelpers } from 'formik/dist/types';
import { usePostNewShootingStatistic, WaitlistItemWithRegistrations } from './waitlist.api';
import { Registration } from './Registration';
import { LoginData } from '../../utils/LoginData';
import { StyledButton } from '../../components/StyledButton';
import { useModal } from '../../components/Modal';
import { SubmitButton } from '../../components/SubmitButton';
import { FormCheckbox } from '../../form/FormikFields';

type ShootingOverviewProps = { data: Array<WaitlistItemWithRegistrations>, loginData: LoginData, refetch: () => void };

export function ShootingOverview({
  data,
  loginData,
  refetch,
}: ShootingOverviewProps) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-3xl">{t('admin.waitlist.titles.registrations')}</h2>
      {data.map((e) => <ShootingType key={e.short} item={e} loginData={loginData} refetch={refetch} />)}
    </>
  );
}

function ShootingType({
  item,
  loginData,
  refetch,
}: { item: WaitlistItemWithRegistrations, loginData: LoginData, refetch: () => void }) {
  const { t } = useTranslation();
  const { id: itemId } = item;
  const [modal, setVisibility] = useModal(t('admin.waitlist.statistics.title'), (setModalOpen) => (
    <StatisticModalContent
      itemId={itemId}
      loginData={loginData}
      setModalOpen={setModalOpen}
    />
  ));
  return (
    <>
      {modal}
      <div className="py-2">
        <div className="flex justify-center space-x-4 text-center">
          <h3 className="inline-block my-3 text-2xl">{item.title}</h3>
          <StyledButton onClick={() => setVisibility(true)}>{t('admin.waitlist.statistics.start')}</StyledButton>
        </div>
        <div className="flex flex-wrap">
          {item.registrations.map((e) => <Registration key={e.person_id} loginData={loginData} registration={e} refetch={refetch} />)}
        </div>
      </div>
    </>
  );
}

type StatisticsModalForm = { is18: boolean, isGroup: boolean };

function StatisticModalContent({
  loginData,
  itemId,
  setModalOpen,
}: { loginData: LoginData, itemId: number, setModalOpen: Dispatch<SetStateAction<boolean>> }) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }, store] = usePostNewShootingStatistic();

  const onSubmit = useCallback(({
    is18,
    isGroup,
  }: StatisticsModalForm, { setSubmitting }: FormikHelpers<StatisticsModalForm>) => {
    const isMinor = !is18;
    store({
      itemId,
      isGroup,
      isMinor,
    }, loginData)
      .then(() => {
        setSubmitting(false);
        setModalOpen(false);
      });
  }, [itemId, loginData, setModalOpen, store]);

  return (
    <Formik
      initialValues={{
        is18: true,
        isGroup: false,
      }}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <>
          <div className="flex flex-wrap justify-around items-center my-2 space-x-4">
            <FormCheckbox label={t('admin.statistics.settings.18+')} name="is18" />
            <FormCheckbox label={t('admin.statistics.settings.groups')} name="groups" />
          </div>
          <SubmitButton formik={formik} data={data} loading={loading} error={error} allowInitialSubmit />
        </>
      )}
    </Formik>
  );
}
