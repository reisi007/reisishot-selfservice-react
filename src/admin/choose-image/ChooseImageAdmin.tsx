import { FolderInformation, useChooseImageThumbnailMetadata } from './choose-image.api';
import { LoginData } from '../../utils/LoginData';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { HOST } from '../../env';
import { PersonManagement } from './PersonManagement';

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
          <Thumbnails loginData={loginData} folder={name} />
          <PersonManagement loginData={loginData} folder={name} person={access} />
        </div>
      ))}
    </>
  );
}

function Thumbnails({
  loginData,
  folder,
}: { loginData: LoginData, folder: string }) {
  const {
    data,
    loading,
    error,
  } = useChooseImageThumbnailMetadata(loginData, folder);

  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator height="5rem" />}>
      {(responses) => (
        <div className="flex flex-wrap justify-evenly my-4">
          {responses.slice(0, 4)
            .map(({
              filename,
              width,
              height,
            }) => (
              <img
                className="object-scale-down m-2"
                width={width}
                height={height}
                key={filename}
                src={`${HOST}/api/choose_pictures_file_get.php?email=${loginData.user}&auth=${loginData.auth}&folder=${folder}&file=thumbnails/${filename}`}
                alt={filename}
              />
            ))}
        </div>
      )}
    </Loadable>
  );
}
