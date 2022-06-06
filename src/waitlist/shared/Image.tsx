type Props = { host?: string, imageId: string, alt: string, ratio: number, className?: string };

export function Image({
  host = 'reisishot.pictures',
  imageId,
  alt,
  ratio,
  className = '',
}: Props) {
  return (
    <div className={`box-content block overflow-hidden relative w-full max-h-[35vh] ${className}`} style={{ paddingTop: `${(100 * ratio).toString(10)}%` }}>
      <img alt={alt} className="object-contain absolute top-0 left-0 mx-auto w-full max-h-full" src={`https://${host}/images/${imageId}_${ImageSizes[2].identifier}.webp`} />
    </div>
  );
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

export const ImageSizes: Array<ImageSize> = [
  new ImageSize('embed', 400),
  new ImageSize('thumb', 700),
  new ImageSize('medium', 1200),
  new ImageSize('large', 2050),
];
