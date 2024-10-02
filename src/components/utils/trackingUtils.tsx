import ReactGA from 'react-ga4';

export const trackEvent = (category: string, action: string, label: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};