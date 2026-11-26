import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectIsLoggedIn, selectToken } from '../redux/auth/auth-selectors';

// Pages only for guests, such as login and register (TASK-7).
const PublicRoute = ({ component, redirectTo = '/home' }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  if (isLoggedIn) return <Navigate to={redirectTo} replace />;

  // Wait until the saved session is checked before showing the form.
  if (token) return null;

  return component;
};

export default PublicRoute;
