import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18next from './i18n';
import { AdminLoginContextProvider } from './admin/AdminLoginContextProvider';
import { Analytics } from './Matomo';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Analytics>
      <I18nextProvider i18n={i18next}>
        <AdminLoginContextProvider>
          <App />
        </AdminLoginContextProvider>
      </I18nextProvider>
    </Analytics>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Remove all service workers
navigator.serviceWorker.getRegistrations()
  .then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
