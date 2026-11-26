import { useId, useState } from 'react';

import { MONTHS, getYearOptions } from '../../helpers/statistics';
import css from './statistics-dashboard.module.css';

// TASK-68 / TASK-69: month and year filters. Each change asks the parent to
// load the summary for the new period.
const StatisticsDashboard = ({ month, year, onChange }) => {
  const id = useId();
  // Read once per mount so the render stays pure.
  const [now] = useState(() => new Date());
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const years = getYearOptions(currentYear);

  const handleMonthChange = (event) => {
    onChange({ month: Number(event.target.value), year });
  };

  const handleYearChange = (event) => {
    const nextYear = Number(event.target.value);
    // Future months of the current year have no data, so clamp to today.
    const nextMonth =
      nextYear === currentYear ? Math.min(month, currentMonth) : month;
    onChange({ month: nextMonth, year: nextYear });
  };

  return (
    <div className={css.dashboard}>
      <label className={css.field} htmlFor={`${id}-month`}>
        <span className={css.label}>Month</span>
        <select
          id={`${id}-month`}
          className={css.select}
          value={month}
          onChange={handleMonthChange}
        >
          {MONTHS.map((name, index) => (
            <option
              key={name}
              value={index + 1}
              disabled={year === currentYear && index + 1 > currentMonth}
            >
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className={css.field} htmlFor={`${id}-year`}>
        <span className={css.label}>Year</span>
        <select
          id={`${id}-year`}
          className={css.select}
          value={year}
          onChange={handleYearChange}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default StatisticsDashboard;
