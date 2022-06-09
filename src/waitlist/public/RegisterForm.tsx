import { useTranslation } from 'react-i18next';
import { Referrable } from '../referral.api';
import { useWaitlistRegister } from './waitlist-public.api';
import { GoToEmailModal } from './GoToEmailModal';
import { WaitlistPersonForm } from '../shared/WaitlistPersonForm';

export function RegisterForm({ referrer }: Referrable) {
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }, put] = useWaitlistRegister();
  return (
    <div>
      <h2>
        {t('waitlist.titles.register')}
      </h2>
      <WaitlistPersonForm
        data={data}
        loading={loading}
        error={error}
        put={put}
        initialValues={{
          referrer,
          firstName: '',
          lastName: '',
          birthday: '',
          email: '',
          availability: '',
          phone_number: '',
          website: '',
        }}
      />
      {!!data && <GoToEmailModal />}
    </div>
  );
}
