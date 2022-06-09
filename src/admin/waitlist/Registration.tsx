import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { AdminWaitlistRecord, useDeleteWaitlistItem, useSetDateAssigned } from './waitlist.api';
import { calculateAge } from '../../utils/Age';
import { ActionButton, RequestActionButton } from './ActionButton';
import { AssessPerson } from './AssessPerson';
import { LoginData } from '../../utils/LoginData';
import { useNavigation } from '../../hooks/useNavigation';

type Props = { registration: AdminWaitlistRecord, loginData: LoginData, refetch: () => void };

export function normalizePhoneNumber(phone: string) {
  return phone; // Test this very well
}

export function Registration({
  registration,
  loginData,
  refetch,
}: Props) {
  const { t } = useTranslation();
  const classes = classNames(
    {
      'border-reisishot border-2': !registration.date_assigned,
      'border-gray-300': registration.date_assigned,
      'border-red-500': registration.ignored,
    },
  );

  const pointClasses = classNames(
    {
      'bg-red-800 text-white': registration.points < 0,
      'bg-reisishot text-white': registration.points >= 100,
    },
  );

  return (
    <div
      className={`flex text-center space-y-1 overflow-hidden relative flex-col grow items-stretch py-4 px-2 my-4 w-full rounded-2xl border sm:mx-4 sm:w-1/2 lg:w-1/3 ${classes}`}
    >
      <FloatingDot registration={registration} />

      <div className="pb-1 text-xl font-semibold">
        {`${registration.firstName} ${registration.lastName} ${calculateAge({ dateString: registration.birthday })}`}
      </div>
      <div>
        <MarkAsReadButton registration={registration} loginData={loginData} />
      </div>
      <div className="flex justify-between mx-auto mb-4 w-full md:w-1/2">
        <a aria-label="Whatsapp" href={`https://wa.me/${normalizePhoneNumber(registration.phone_number)}`} rel="noopener noreferrer" target="_blank"><i className="icon rs-whatsapp rs-2xl" /></a>
        <a aria-label="Email" href={`mailto:${registration.email}`} target="_blank" rel="noreferrer"><i className="icon rs-mail rs-2xl" /></a>
      </div>
      <div className={`mx-auto py-2 px-4 mx-auto text-lg font-semibold text-center rounded-lg ${pointClasses}`}>
        <span className="underline">{registration.points}</span>
        &nbsp;
        <span className="text-base">{t('waitlist.points')}</span>
      </div>
      <p className="grow">
        {t('waitlist.availability')}
        :
        {' '}
        {registration.availability}
      </p>
      {registration.text !== undefined && registration.text.length > 0
       && (
         <p>
           {t('waitlist.moreInfo')}
           :
           {' '}
           {registration.text}
         </p>
       )}
      <RegistrationActions registration={registration} loginData={loginData} refetch={refetch} />
    </div>
  );
}

function RegistrationActions({
  registration,
  loginData,
  refetch,
}: Props) {
  const { t } = useTranslation();
  const [, navigate] = useNavigation();
  const {
    person_id: person,
    item_id: item,
  } = registration;
  const [deleteState, deletePerson] = useDeleteWaitlistItem();
  return (
    <div className="grid gap-2 mx-auto mt-2 sm:grid-cols-2 lg:w-3/4 xl:grid-cols-4 xl:w-full 2xl:w-3/4">
      <ActionButton
        onClick={() => navigate({
          newUrl: '../contracts',
          state: registration,
        })}
        className="text-white bg-reisishot"
      >
        {t('admin.contract.title')}
      </ActionButton>
      <RequestActionButton
        request={deleteState}
        onClick={() => deletePerson({
          person,
          item,
        }, loginData)
          .then(refetch)}
        className="text-white bg-reisishot"
      >
        {t('actions.delete')}
      </RequestActionButton>
      <AssessPerson loginData={loginData} registration={registration} />
    </div>
  );
}

function FloatingDot({ registration }: { registration: AdminWaitlistRecord }) {
  const classes = classNames(
    {
      'sm:bg-reisishot': !registration.date_assigned,
      'sm:bg-red-500': registration.ignored,
    },
  );
  return <span className={`absolute right-4 w-3 h-3 rounded-full ${classes}`} />;
}

function MarkAsReadButton({
  registration,
  loginData,
}: { registration: AdminWaitlistRecord, loginData: LoginData }) {
  const {
    person_id: personId,
    item_id: itemId,
    date_assigned: dateAssigned,
  } = registration;
  const [isDateAssigned, setStateAssigned] = useState(dateAssigned);
  const { t } = useTranslation();
  const [request, post] = useSetDateAssigned();

  const dateAssignedButtonText = t(isDateAssigned ? 'admin.waitlist.markAs.unread' : 'admin.waitlist.markAs.read');
  const onClick = useCallback(() => {
    post({
      itemId,
      personId,
      value: !isDateAssigned,
    }, loginData)
      .then(() => setStateAssigned((b) => !b));
  }, [isDateAssigned, itemId, loginData, personId, post]);
  return (
    <RequestActionButton
      request={request}
      onClick={onClick}
      className="py-1 px-4 mx-auto mb-2 font-normal rounded-lg border"
    >
      {dateAssignedButtonText}
    </RequestActionButton>
  );
}
