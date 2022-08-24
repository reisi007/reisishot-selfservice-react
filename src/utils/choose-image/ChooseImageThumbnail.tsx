import { LoginData } from '../LoginData';
import { useChooseImageThumbnailMetadata } from '../../waitlist/private/selfservice/choose-image/ChooseImage.api';
import { Loadable } from '../../components/Loadable';
import { LoadingIndicator } from '../../LoadingIndicator';
import { HOST } from '../../env';

export function ChooseImageThumbnails({
  loginData,
  folder,
  limit = 4,
}: { loginData: LoginData, folder: string, limit?: number }) {
  const {
    user,
    auth,
  } = loginData;
  const {
    data,
    loading,
    error,
  } = useChooseImageThumbnailMetadata(loginData, folder);

  return (
    <Loadable data={data} loading={loading} error={error} loadingElement={<LoadingIndicator height="5rem" />}>
      {(responses) => (
        <div className="flex flex-wrap justify-evenly my-4">
          {responses.slice(0, limit)
            .map(({
              filename,
              width,
              height,
            }) => (
              <img
                className="object-scale-down m-2"
                loading="lazy"
                width={width}
                height={height}
                key={filename}
                src={`${HOST}/api/choose_pictures_file_get.php?email=${user}&accesskey=${auth}&folder=${folder}&file=thumbnails/${filename}`}
                alt={filename}
              />
            ))}
        </div>
      )}
    </Loadable>
  );
}
