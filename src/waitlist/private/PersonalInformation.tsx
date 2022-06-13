import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { LoginData } from '../../utils/LoginData';
import { WaitlistPerson } from '../public/waitlist-public.api';
import { useWaitlistPerson } from './waitlist-private.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Badge } from '../../components/Badge';
import { useShowPointsDetailModal } from './ShowPointsDetailModal';
import { StyledButton, StyledLinkButton } from '../../components/StyledButton';

export function PersonalInformation({ loginData }: { loginData: LoginData }) {
  const [{
    data,
    loading,
    error,
  }] = useWaitlistPerson(loginData);
  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
      {(response) => <DisplayPersonalInformation loginData={loginData} person={response} />}
    </Loadable>
  );
}

function PointInformation({
  points,
  loginData,
}: { points: number, loginData: LoginData }) {
  const [pointsModal, showPointsModal] = useShowPointsDetailModal(loginData);
  const { origin } = window.location;
  const { t } = useTranslation();
  const isPositive = points >= 0;
  const referralLink = `${origin}/waitlist/${loginData.user}`;
  const copyReferralLinkOnClick = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    return false;
  }, [referralLink]);
  return (
    <>
      <div className="flex  justify-center items-center">
        <Badge
          className="text-center"
          background={isPositive ? 'bg-reisishot' : 'bg-red-500'}
          text="text-gray-100"
        >
          {points}
          {' '}
          {t('waitlist.points')}
        </Badge>
      </div>
      <div className="grid gap-2 mt-2 md:grid-cols-2">
        <StyledButton className="py-0" onClick={() => showPointsModal(true)}>{t('waitlist.pointHistory.openText')}</StyledButton>
        <StyledLinkButton href={referralLink} className="py-0" onClick={copyReferralLinkOnClick}>{t('waitlist.copyReferralLink')}</StyledLinkButton>
      </div>
      {pointsModal}
    </>
  );
}

function DisplayPersonalInformation({
  loginData,
  person,
}: { loginData: LoginData, person: WaitlistPerson }) {
  const {
    firstName,
    points,
  } = person;
  const { t } = useTranslation();

  return (
    <>
      <h2 className="mb-2 text-2xl">{t('waitlist.xHello', { name: firstName })}</h2>
      <PointInformation loginData={loginData} points={points} />
      <div className="flex justify-center items-center my-2 mt-4"><Review person={person} /></div>
    </>
  );
}

function Review({ person }: { person: WaitlistPerson }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <StyledButton onClick={() => {
      navigate('/reviews/write', { state: person });
    }}
    >
      {t('waitlist.review')}
    </StyledButton>
  );
}
