import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { TabProps } from '../TabProps';
import { AvailableChooseImageData, useAvailableChooseImage } from './ChooseImage.api';
import { Loadable } from '../../../../components/Loadable';
import { LoadingIndicator } from '../../../../LoadingIndicator';
import { Card } from '../../../../components/Card';
import { ChooseImageThumbnails } from '../../../../utils/choose-image/ChooseImageThumbnail';
import { LoginData } from '../../../../utils/LoginData';
import { StyledLinkButton } from '../../../../components/StyledButton';

export function ChooseImageTab({
  data: loginData,
  className,
}: TabProps) {
  const {
    data,
    loading,
    error,
  } = useAvailableChooseImage(loginData);
  return (
    <div className={classNames(className)}>
      <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator />}>
        {(result) => result.map((i) => <Item key={i.folder} {...loginData} folder={i.folder} />)}
      </Loadable>
    </div>
  );
}

function Item({
  folder,
  ...loginData
}: AvailableChooseImageData & LoginData) {
  const { t } = useTranslation();
  return (
    <Card>
      <h3>{folder}</h3>
      <ChooseImageThumbnails folder={folder} loginData={loginData} limit={2} />
      <StyledLinkButton href={`./choose/${folder}`}>
        {t('waitlist.titles.selfservice.tabs.choose_image.start_review')}
      </StyledLinkButton>
    </Card>
  );
}
