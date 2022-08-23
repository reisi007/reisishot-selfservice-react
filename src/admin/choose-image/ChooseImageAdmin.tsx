import { FolderInformation } from './choose-image.api';
import { LoginData } from '../../utils/LoginData';
import { PersonManagement } from './PersonManagement';
import { ChooseImageThumbnails } from '../../utils/choose-image/ChooseImageThumbnail';

export function ChooseImageAdmin({
  loginData,
  data,
}: { loginData: LoginData, data: Array<FolderInformation> }) {
  return (
    <>
      {data.map(({
        name,
        cnt,
        access,
      }) => (
        <div className="justify-self-center p-4 mx-auto w-full rounded-lg border-2 border-reisishot" key={name}>
          <h2 className="text-3xl">
            {name}
            {' '}
            (
            {cnt}
            )
          </h2>
          <ChooseImageThumbnails loginData={loginData} folder={name} />
          <PersonManagement loginData={loginData} folder={name} person={access} />
        </div>
      ))}
    </>
  );
}
