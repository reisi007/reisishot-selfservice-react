import { createInstance, MatomoProvider, useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect, useMemo } from 'react';
import { TrackEventParams, TrackPageViewParams } from '@jonkoops/matomo-tracker-react/lib/types';
import { useLocation } from 'react-router-dom';
import { MODE_DEBUG } from './env';

const INSTANCE = createInstance({
  urlBase: 'https://analytics.reisinger.pictures/',
  siteId: 8,
  configurations: { setSecureCookie: !MODE_DEBUG },
});

export function Analytics({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <MatomoProvider value={INSTANCE}>
      {children}
    </MatomoProvider>
  );
}

export function TrackPageView() {
  const { trackPageView } = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location, trackPageView]);

  return <>{false}</>;
}

export function useAnalytics(): { trackEvent: (p: TrackEventParams) => void, trackPageView: (p?: TrackPageViewParams) => void } {
  const {
    trackPageView: baseTrackPageView,
    trackEvent: baseTrackEvent,
  } = useMatomo();

  return useMemo(() => {
    const trackEvent = (params: TrackEventParams) => {
      params.action = `${params.category}_${params.action}`;
      // console.log('Track action', params);
      return baseTrackEvent(params);
    };

    const trackPageView = (params?: TrackPageViewParams) => {
      // console.log('Track pageview', params);
      baseTrackPageView(params);
    };
    return ({
      trackPageView,
      trackEvent,
    });
  }, [baseTrackPageView, baseTrackEvent]);
}
