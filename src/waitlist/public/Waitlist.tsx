import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { PublicCalendar } from '../../components/calendar/PublicCalendar';
import { usePublicWaitlistItems } from './waitlist-public.api';
import { DisplayWaitlistItems } from '../shared/DisplayWaitlistItems';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { StyledButton } from '../../components/StyledButton';
import { useWaitlistLogin } from '../WaitlistContextProvider';
import { ContactMe } from '../shared/ContactMe';
import { PreviewContract } from '../shared/PreviewContract';

export function Waitlist() {
  const { referrer } = useParams<'referrer'>();
  const { t } = useTranslation();
  const [{
    data,
    loading,
    error,
  }] = usePublicWaitlistItems();
  const navigate = useNavigate();
  const [loginData] = useWaitlistLogin();

  useEffect(() => {
    if (!referrer && loginData) navigate('./book');
  }, [loginData, navigate, referrer]);

  return (
    <>
      <h1 className="text-4xl font-thin">
        {t('waitlist.titles.public')}
      </h1>
      {referrer && <p className="text-xl font-thin text-center">{t('referable.referredBy', { referrer })}</p>}
      <div className="grid gap-4 items-center my-2 md:grid-cols-2">
        <LoginForm />
        <RegisterForm />
      </div>
      <ContactMe />
      <PreviewContract />
      <PublicCalendar weeks={4} />
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(items) => (
          <DisplayWaitlistItems items={items}>
            {() => <StyledButton disabled className="w-full">{t('waitlist.publicActionButton')}</StyledButton>}
          </DisplayWaitlistItems>
        )}
      </Loadable>
    </>
  );
}
