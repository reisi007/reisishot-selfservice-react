import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { WaitlistItem } from '../public/waitlist-public.api';
import { Image } from './Image';

type Props = { items: Array<WaitlistItem>, children: ItemProps['children'] };

export function DisplayWaitlistItems({
  items,
  children,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2">
      {items.map((e) => <DisplayWaitlistItem key={e.id} item={e}>{children}</DisplayWaitlistItem>)}
    </div>
  );
}

type ItemProps = { item: WaitlistItem, children: (item: WaitlistItem) => ReactNode };

function DisplayWaitlistItem({
  item,
  children,
}: ItemProps) {
  const {
    title,
    image_id: imageId,
    description,
  } = item;
  return (
    <div className="flex flex-col p-2 rounded-xl border border-black">
      <h3 className="text-2xl font-light">{title}</h3>
      <Image className="my-4" imageId={imageId} alt={title} ratio={2 / 3} />
      <p className="grow text-center whitespace-pre-line">{description}</p>
      <div className="box-border m-2">
        {children(item)}
      </div>
    </div>
  );
}
