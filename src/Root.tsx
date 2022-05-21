import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from 'react-bootstrap';

export default function Root() {
  const {t} = useTranslation();
  const items = [
    {title: t('root.waitlist')},
    {title: t('root.review')},
    {title: t('root.admin')},
  ];

  return <div className="text-center h-100 d-flex flex-column">
    <h1>{t('title')}</h1>
    <div className="m-2 mx-auto d-flex flex-grow-1 flex-column justify-content-center w-100 w-sm-50">
      {
        items.map(({title}) => <Button key={title} className="my-2" variant="outline-primary">{title}</Button>)
      }
    </div>
  </div>;
};
