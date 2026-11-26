import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { formatAmount } from '../../helpers/statistics';
import css from './chart.module.css';

ChartJS.register(ArcElement, Tooltip);

const EMPTY_COLOR = 'rgb(255 255 255 / 20%)';

const options = {
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ({ label, raw }) => ` ${label}: ₴ ${formatAmount(raw)}`,
      },
    },
  },
};

// TASK-66 / TASK-67: doughnut of the period's expenses; it re-renders whenever
// the selected month or year brings new categories.
const Chart = ({ categories, balance }) => {
  const isEmpty = categories.length === 0;

  const data = {
    labels: isEmpty ? ['No expenses'] : categories.map(({ name }) => name),
    datasets: [
      {
        data: isEmpty ? [1] : categories.map(({ total }) => total),
        backgroundColor: isEmpty
          ? [EMPTY_COLOR]
          : categories.map(({ color }) => color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={css.chart}>
      <Doughnut
        data={data}
        options={{
          ...options,
          plugins: {
            ...options.plugins,
            tooltip: { ...options.plugins.tooltip, enabled: !isEmpty },
          },
        }}
        aria-label="Expenses by category"
        role="img"
      />
      <p className={css.balance}>
        ₴ {formatAmount(balance, { keepSign: true })}
      </p>
    </div>
  );
};

export default Chart;
