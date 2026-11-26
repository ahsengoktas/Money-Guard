import { Navigate } from 'react-router-dom';

import CurrencyTab from '../components/currency-tab/currency-tab';
import { useMediaQuery, MOBILE_QUERY } from '../hooks/use-media-query';

// TASK-30: /currency is a mobile-only tab. On wider screens the rates are
// already shown in the sidebar, so send the user back to /home.
const CurrencyRoute = () => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  if (!isMobile) return <Navigate to="/home" replace />;

  return <CurrencyTab />;
};

export default CurrencyRoute;
