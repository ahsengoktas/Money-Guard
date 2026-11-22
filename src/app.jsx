import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import { refreshUser } from './redux/auth/auth-operations';
import PrivateRoute from './routes/private-route';
import PublicRoute from './routes/public-route';

const RegistrationPage = lazy(
  () => import('./pages/registration-page/registration-page'),
);
const LoginPage = lazy(() => import('./pages/login-page/login-page'));
const DashboardPage = lazy(
  () => import('./pages/dashboard-page/dashboard-page'),
);
const NotFoundPage = lazy(
  () => import('./pages/not-found-page/not-found-page'),
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    // The Loader component (TASK-36–39) can replace this fallback.
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/register"
          element={<PublicRoute component={<RegistrationPage />} />}
        />
        <Route
          path="/login"
          element={<PublicRoute component={<LoginPage />} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute component={<DashboardPage />} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
