import { useTranslation } from 'react-i18next';
import { LoginData } from '../utils/LoginData';
import { Loadable } from '../components/Loadable';
import { useGetContractData } from './contract-private.api';
import { LoadingIndicator } from '../LoadingIndicator';
import { Card } from '../components/Card';
import Markdown from '../utils/markdown/Markdown';
import { formatDateTime } from '../utils/Age';

export function DisplayContract({ loginData }: { loginData: LoginData }) {
  const { user } = loginData;
  const { t } = useTranslation();
  const request = useGetContractData(loginData);
  return (
    <Loadable request={request} loadingElement={<LoadingIndicator height="10rem" />}>
      {(data) => {
        const {
          markdown,
          hash_value: hash,
          hash_algo: algo,
          due_date: dueDateTime,
        } = data;
        const formattedDateTime = formatDateTime(dueDateTime);
        return (
          <>
            <h1>
              {t('contracts.display.title', {
                name: user,
                dateTime: formattedDateTime,
              })}
            </h1>
            <Card className="my-2 border-black">
              <Markdown className="text-center" content={markdown} />
            </Card>
            <small className="font-mono text-sm break-all">
              Hash:
              {' '}
              {hash}
              {' '}
              (
              {algo}
              )
            </small>
          </>
        );
      }}
    </Loadable>
  );
}
