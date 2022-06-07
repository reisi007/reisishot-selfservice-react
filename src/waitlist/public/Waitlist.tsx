import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { PublicCalendar } from '../../components/calendar/PublicCalendar';
import { usePublicWaitlistItems } from './waitlist-public.api';
import { DisplayWaitlistItems } from '../shared/DisplayWaitlistItems';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { StyledButton } from '../../components/StyledButton';

export function Waitlist() {
  const { referrer } = useParams<'referrer'>();
  const { t } = useTranslation();
  const request = usePublicWaitlistItems();
  return (
    <>
      <h1>
        {t('waitlist.titles.public')}
      </h1>
      {referrer && <p className="text-xl font-thin text-center">{t('referrable.referredBy', { referrer })}</p>}
      <div className="grid gap-4 items-center my-2 md:grid-cols-2">
        <LoginForm />
        <RegisterForm />
      </div>
      <PublicCalendar weeks={4} />
      <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
        {(items) => (
          <DisplayWaitlistItems items={items}>
            {() => <StyledButton disabled className="w-full">{t('waitlist.titles.publicActionButton')}</StyledButton>}
          </DisplayWaitlistItems>
        )}
      </Loadable>
    </>
  );
}
