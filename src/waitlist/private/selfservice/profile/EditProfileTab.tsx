import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useUpdateWaitlistPerson, useWaitlistPerson } from '../../waitlist-private.api';
import { Loadable } from '../../../../components/Loadable';
import { LoadingIndicator } from '../../../../LoadingIndicator';
import { WaitlistPersonForm } from '../../../shared/WaitlistPersonForm';
import { TabProps } from '../TabProps';

export function EditProfileTab({
  className,
  data: loginData,
}: TabProps) {
  const { t } = useTranslation();
  const [{
    data: personData,
    loading: personLoading,
    error: personError,
  }] = useWaitlistPerson(loginData);
  const [{
    data: updateData,
    loading: updateLoading,
    error: updateError,
  }, put] = useUpdateWaitlistPerson(loginData);
  return (
    <div className={classNames(className)}>
      <h2>{t('waitlist.titles.selfservice.tabs.profile.title.long')}</h2>
      <Loadable className="relative" data={personData} loading={personLoading} error={personError} loadingElement={<LoadingIndicator />}>
        {(request) => (
          <WaitlistPersonForm initialValues={request} put={put} data={updateData} loading={updateLoading} error={updateError}>
            <>
              {t('actions.save')}
            </>
          </WaitlistPersonForm>
        )}
      </Loadable>
    </div>
  );
}
