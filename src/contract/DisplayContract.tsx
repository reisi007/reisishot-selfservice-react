import { useTranslation } from 'react-i18next';
import { LoginData } from '../utils/LoginData';
import { ContractData } from './contract-private.api';
import { Card } from '../components/Card';
import Markdown from '../utils/markdown/Markdown';
import { formatDateTime } from '../utils/Age';

export function DisplayContract({
  loginData,
  contractData,
}: { loginData: LoginData, contractData: ContractData }) {
  const { user } = loginData;
  const { t } = useTranslation();

  const {
    markdown,
    dsgvo_markdown: dsgvoMarkdown,
    hash_value: hash,
    hash_algo: algo,
    due_date: dueDateTime,
  } = contractData;
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
        {dsgvoMarkdown !== undefined && (
          <>
            <br />
            <Markdown className="text-center" content={dsgvoMarkdown} />
          </>
        )}
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
}
