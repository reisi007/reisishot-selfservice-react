import { AriaRole, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSizes } from '../utils/icons';

type Props = { starClassName: IconSizes, className?: string, halfStar: boolean, fullStars: number, totalStars: number, setStars?: (fullStars: number, halfStar: boolean) => void };

export function StarRating(
  {
    halfStar,
    fullStars,
    setStars,
    totalStars,
    starClassName,
    className = '',
  }: Props,
) {
  const starClassNameBase = 'icon px-2';
  const filledStars = fullStars - (halfStar ? 1 : 0);
  const emptyStars = totalStars - filledStars;
  const editable = setStars !== undefined;
  const { t } = useTranslation();
  const onClick = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!editable) return;
    const targetHtmlElement = e.target as HTMLElement;
    const htlmlElementChildren = targetHtmlElement?.parentElement?.children;
    if (htlmlElementChildren == null) {
      return;
    }
    const children = Array.from(htlmlElementChildren);
    let clickedStar = children.indexOf(targetHtmlElement) + 1;

    const clickX = e.clientX;
    const targetRect = targetHtmlElement.getBoundingClientRect();

    const isHalfStar = targetRect.x + targetRect.width / 2 > clickX;
    if (isHalfStar) {
      clickedStar -= 1;
    }

    setStars(clickedStar, isHalfStar);
  }, [editable, setStars]);

  const role: AriaRole = editable ? 'button' : 'none';

  return (
    <div className={`text-reisishot ${className}`}>
      {
        Array.from({ length: fullStars }, (_, idx) => idx)
          .map((i) => (
            <i
              key={i}
              aria-label={t('reviews.xStars', { stars: i })}
              role={role}
              onClick={(e) => onClick(e)}
              className={`${starClassNameBase} rs-star-full ${starClassName}`}
            />
          ))
      }
      {
        halfStar && (
        <i
          aria-label={t('reviews.xStars', { stars: (fullStars + 1).toString(10) })}
          role={role}
          onClick={(e) => onClick(e)}
          className={`${starClassNameBase} rs-star-half ${starClassName}`}
        />
        )
      }
      {
        Array.from({ length: emptyStars }, (_, idx) => idx)
          .map((i) => (
            <i
              aria-label={t('reviews.xStars', { stars: (filledStars + 1).toString(10) })}
              key={i}
              role={role}
              onClick={(e) => onClick(e)}
              className={`${starClassNameBase} rs-star-empty ${starClassName}`}
            />
          ))
      }
    </div>
  );
}
