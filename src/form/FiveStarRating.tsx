import { useCallback, useMemo } from 'react';
import { StarRating } from './StarRating';

type Props = { starClassName: 'rs-xs' | 'rs-sm' | 'rs-lg', className?: string, percentage: number, setPercentage?: (value: number) => void };

export function FiveStarRating({
  starClassName,
  className,
  percentage,
  setPercentage,
}: Props) {
  const [fullStars, isHalfStar] = useMemo(() => {
    const full = Math.floor(percentage / 20);
    const remainder = percentage - (full * 20);
    const isHalf = remainder >= 10;
    return [full, isHalf];
  }, [percentage]);

  const onClick = useCallback((full: number, half: boolean): void => {
    const nextValue = 20 * full + (half ? 10 : 0);
    if (setPercentage) {
      setPercentage(nextValue);
    }
  }, [setPercentage]);

  return <StarRating className={className} starClassName={starClassName} halfStar={isHalfStar} fullStars={fullStars} totalStars={5} setStars={setPercentage === undefined ? undefined : onClick} />;
}
