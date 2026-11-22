import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectIsLoggedIn, selectToken } from '../redux/auth/auth-selectors';

// Pages that need a logged-in user (TASK-7).
const PrivateRoute = ({ component, redirectTo = '/login' }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  if (isLoggedIn) return component;

  // A saved token means the session is still being restored: wait instead of
  // sending the user to the login page.
  if (token) return null;

  return <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
