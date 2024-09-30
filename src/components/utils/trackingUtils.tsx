import ReactGA from 'react-ga4';

export const trackEvent = (category: string, action: string, label: string, value?: number) => {
  console.log(`${label} button clicked`);
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};