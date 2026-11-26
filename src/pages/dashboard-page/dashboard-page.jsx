import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import Header from '../../components/header/header';
import Navigation from '../../components/navigation/navigation';
import Balance from '../../components/balance/balance';
import { fetchBalance } from '../../redux/finance/finance-operations';
import { useMediaQuery, MOBILE_QUERY } from '../../hooks/use-media-query';
import css from './dashboard-page.module.css';

// TASK-23: shared layout for /home, /statistics and /currency.
// Tablet and desktop show Balance and Currency next to the navigation on every
// tab; on mobile Balance lives inside HomeTab and Currency has its own tab.
const DashboardPage = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(MOBILE_QUERY);

  // Balance is visible on the statistics tab too, so load it here as well.
  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <div className={css.page}>
      <Header />
      <div className={css.container}>
        <aside className={css.sidebar}>
          <div className={css.summary}>
            <Navigation />
            {!isMobile && <Balance />}
          </div>
          {/* The Currency component (PR #8) is mounted here on tablet/desktop. */}
          {!isMobile && <div className={css.currency} />}
        </aside>
        <main className={css.content}>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
