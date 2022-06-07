import { useMemo } from 'react';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';

type Props = { host?: string, imageId: string, alt: string, ratio: number, className?: string };

export function Image({
  host,
  imageId,
  alt,
  ratio,
  className = '',
}: Props) {
  return (
    <ResponsiveContainer className={`box-content block overflow-hidden relative w-full max-h-[35vh] ${className}`} style={{ paddingTop: `${(100 * ratio).toString(10)}%` }}>
      {(width) => <ImageInternal imageId={imageId} host={host} alt={alt} width={width} />}
    </ResponsiveContainer>
  );
}

type InternalProps = { width: number, alt: string, host?: string, imageId: string };

function ImageInternal({
  width,
  alt,
  host = 'reisishot.pictures',
  imageId,
}: InternalProps) {
  const identifier = useMemo(() => {
    const desiredSize = ALL_IMAGE_SIZES.find((e) => e.size >= width) ?? ALL_IMAGE_SIZES[ALL_IMAGE_SIZES.length - 1];
    return desiredSize.identifier;
  }, [width]);
  return <img alt={alt} className="object-contain absolute top-0 left-0 mx-auto w-full max-h-full" src={`https://${host}/images/${imageId}_${identifier}.webp`} />;
}

class ImageSize {
  constructor(
    readonly identifier: string,
    readonly size: number,
  ) {
  }

  isLargerThan(requiredSize: number): boolean {
    return this.size > requiredSize;
  }
}

export const ALL_IMAGE_SIZES: Array<ImageSize> = [
  new ImageSize('embed', 400),
  new ImageSize('thumb', 700),
  new ImageSize('medium', 1200),
  new ImageSize('large', 2050),
];
