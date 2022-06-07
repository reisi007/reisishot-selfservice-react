import { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { LoginData } from '../../utils/LoginData';
import { useModal } from '../../components/Modal';
import { StyledButton } from '../../components/StyledButton';
import { ReferralPointEntry, useGetPointHistory, useTranslateReferralType } from '../referral.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { FormattedDateTime } from '../../utils/Age';

export function useShowPointsDetailModal(loginData: LoginData) {
  const content = useCallback((setOpen: Dispatch<SetStateAction<boolean>>) => <ModalContent loginData={loginData} setOpen={setOpen} />, [loginData]);
  return useModal(content);
}

type ModalProps = { loginData: LoginData, setOpen: Dispatch<SetStateAction<boolean>> };

function ModalContent({
  loginData,
  setOpen,
}: ModalProps) {
  const { t } = useTranslation();
  const request = useGetPointHistory(loginData);
  return (
    <>
      <h1>{t('waitlist.pointHistory.modal.title')}</h1>
      <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
        {(data) => <DisplayPointsHistory data={data} />}
      </Loadable>
      <StyledButton className="w-full text-white bg-reisishot" onClick={() => setOpen(false)}>{t('actions.close')}</StyledButton>
    </>
  );
}

function DisplayPointsHistory({ data }: { data: Array<ReferralPointEntry> }) {
  const tk = useTranslateReferralType();
  return (
    <div className="grid gap-2 m-2 md:grid-cols-2">
      {
        data.map(({
          key,
          points,
          timestamp,
        }) => {
          const pointsClassName = classNames({
            'text-red-500': points < 0,
            'text-reisishot ': points > 0,
          });
          const centerItemClasses = 'flex justify-center items-center';
          return (
            <Card className="space-y-2" key={timestamp + key}>
              <h2>{tk(key)}</h2>
              <div className={centerItemClasses}>
                <Badge><FormattedDateTime dateString={timestamp} /></Badge>
              </div>
              <div className={centerItemClasses}>
                <span className={`text-center font-semibold inline-block text-2xl ${pointsClassName}`}>
                  {points}
                </span>
              </div>
            </Card>
          );
        })
      }
    </div>
  );
}
