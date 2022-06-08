import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { LoginData } from '../../utils/LoginData';
import { useModal } from '../../components/Modal';
import { ReferralPointEntry, useGetPointHistory, useTranslateReferralType } from '../referral.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { FormattedDateTime } from '../../utils/Age';

export function useShowPointsDetailModal(loginData: LoginData) {
  const content = useCallback(() => <ModalContent loginData={loginData} />, [loginData]);
  const { t } = useTranslation();
  return useModal(t('waitlist.pointHistory.modal.title'), content);
}

type ModalProps = { loginData: LoginData };

function ModalContent({
  loginData,
}: ModalProps) {
  const request = useGetPointHistory(loginData);
  return (
    <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
      {(data) => (
        <div className="overflow-y-auto max-h-[50%]">
          <DisplayPointsHistory data={data} />
        </div>
      )}
    </Loadable>
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
