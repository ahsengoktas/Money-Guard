import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import { refreshUser } from './redux/auth/auth-operations';
import PrivateRoute from './routes/private-route';
import PublicRoute from './routes/public-route';
import CurrencyRoute from './routes/currency-route';

const RegistrationPage = lazy(
  () => import('./pages/registration-page/registration-page'),
);
const LoginPage = lazy(() => import('./pages/login-page/login-page'));
const DashboardPage = lazy(
  () => import('./pages/dashboard-page/dashboard-page'),
);
const HomeTab = lazy(() => import('./components/home-tab/home-tab'));
const StatisticsTab = lazy(
  () => import('./components/statistics-tab/statistics-tab'),
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
        <Route
          path="/register"
          element={<PublicRoute component={<RegistrationPage />} />}
        />
        <Route
          path="/login"
          element={<PublicRoute component={<LoginPage />} />}
        />
        {/* TASK-23 / TASK-30: dashboard tabs share one private layout. */}
        <Route
          path="/"
          element={<PrivateRoute component={<DashboardPage />} />}
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomeTab />} />
          <Route path="statistics" element={<StatisticsTab />} />
          <Route path="currency" element={<CurrencyRoute />} />
          <Route path="dashboard" element={<Navigate to="/home" replace />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
