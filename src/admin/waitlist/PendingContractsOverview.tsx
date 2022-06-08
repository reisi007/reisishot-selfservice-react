import { useTranslation } from 'react-i18next';
import { PendingSignaturInformation } from './waitlist.api';
import { formatDate } from '../../utils/Age';
import { LoginData } from '../../utils/LoginData';
import { StyledInputField } from '../../form/StyledFields';
import { FormLabel } from '../../form/FormikFields';
import { computeContractLink } from '../../utils/baseUrl';

type Props = { data: Array<PendingSignaturInformation>, loginData: LoginData };

export function PendingContractsOverview({ data }: Props) {
  const { t } = useTranslation();
  return (
    <>
      {data.length > 0 && (
        <>
          <h2 className="text-3xl">{t('admin.waitlist.pendingSignatures.title')}</h2>
          <ul className="my-2">
            {data.map(({
              due_date: dueDate,
              email,
              access_key: accessKey,
            }) => {
              const label = `${t('admin.waitlist.pendingSignatures.text', { dueDate: formatDate(dueDate) })}:`;
              const key = email + accessKey + dueDate;
              return (
                <li className="flex items-center my-2 space-x-2 w-full" key={key}>
                  <FormLabel name={key} label={label} required={false} />
                  <StyledInputField
                    className="grow"
                    error={false}
                    name={key}
                    readOnly
                    value={computeContractLink({
                      user: email,
                      auth: accessKey,
                    })}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
