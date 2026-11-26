import { formatAmount } from '../../helpers/statistics';
import css from './statistics-table.module.css';

// TASK-70 / TASK-71: expense categories of the period and its totals.
const StatisticsTable = ({ categories, expenseSummary, incomeSummary }) => {
  return (
    <div className={css.wrapper}>
      <table className={css.table}>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col" className={css.sum}>
              Sum
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={2} className={css.empty}>
                No expenses for this period
              </td>
            </tr>
          ) : (
            categories.map(({ name, total, color }) => (
              <tr key={name}>
                <th scope="row" className={css.category}>
                  <span className={css.name}>
                    <span
                      className={css.swatch}
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    {name}
                  </span>
                </th>
                <td className={css.sum}>{formatAmount(total)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <dl className={css.totals}>
        <div className={css.total}>
          <dt>Expenses:</dt>
          <dd className={css.expense}>{formatAmount(expenseSummary)}</dd>
        </div>
        <div className={css.total}>
          <dt>Income:</dt>
          <dd className={css.income}>{formatAmount(incomeSummary)}</dd>
        </div>
      </dl>
    </div>
  );
};

export default StatisticsTable;
