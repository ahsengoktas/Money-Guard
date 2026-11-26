import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Chart from '../chart/chart';
import StatisticsDashboard from '../statistics-dashboard/statistics-dashboard';
import StatisticsTable from '../statistics-table/statistics-table';
import { selectTotalBalance } from '../../redux/finance/finance-selectors';
import { fetchStatistics } from '../../redux/statistics/statistics-operations';
import {
  selectExpenseCategories,
  selectStatisticsPeriod,
  selectStatisticsSummary,
} from '../../redux/statistics/statistics-selectors';
import { setPeriod } from '../../redux/statistics/statistics-slice';
import css from './statistics-tab.module.css';

// TASK-63–65: /statistics tab with the chart, period filters and table.
const StatisticsTab = () => {
  const dispatch = useDispatch();
  const { month, year } = useSelector(selectStatisticsPeriod);
  const summary = useSelector(selectStatisticsSummary);
  const categories = useSelector(selectExpenseCategories);
  const balance = useSelector(selectTotalBalance);

  // TASK-64 / TASK-69: load the summary for the current or selected period.
  useEffect(() => {
    const request = dispatch(fetchStatistics({ month, year }));
    request.unwrap().catch((error) => {
      if (error?.name !== 'AbortError') toast.error(error);
    });
    // A quick filter change cancels the previous request.
    return () => request.abort();
  }, [dispatch, month, year]);

  const handlePeriodChange = (period) => {
    dispatch(setPeriod(period));
  };

  return (
    <section className={css.statistics} aria-labelledby="statistics-title">
      <h2 id="statistics-title" className={css.title}>
        Statistics
      </h2>
      <div className={css.chart}>
        <Chart categories={categories} balance={balance} />
      </div>
      <div className={css.details}>
        <StatisticsDashboard
          month={month}
          year={year}
          onChange={handlePeriodChange}
        />
        <StatisticsTable
          categories={categories}
          expenseSummary={summary?.expenseSummary ?? 0}
          incomeSummary={summary?.incomeSummary ?? 0}
        />
      </div>
    </section>
  );
};

export default StatisticsTab;
