import { useTranslation } from 'react-i18next';

export function ContactMe() {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="mt-2 text-2xl font-light">{t('waitlist.contactMe.title')}</h2>
      <p className="my-2 text-center">{t('waitlist.contactMe.body')}</p>
      <div className="flex justify-between mx-auto mb-4 w-full md:w-1/2">
        <a aria-label="Whatsapp" href="https://wa.me/436702017710" rel="noopener noreferrer" target="_blank"><i className="icon rs-whatsapp rs-2xl" /></a>
        <a aria-label="Facebook Messenger" href="https://m.me/reisishot" rel="noopener noreferrer" target="_blank"><i className="icon rs-messenger rs-2xl" /></a>
        <a aria-label="Email" href="mailto:florian@reisishot.pictures" target="_blank" rel="noreferrer"><i className="icon rs-mail rs-2xl" /></a>
      </div>
    </>
  );
}
