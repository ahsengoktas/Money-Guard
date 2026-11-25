import { useSelector } from 'react-redux';
import {
  selectBalanceError,
  selectBalanceLoading,
  selectTotalBalance,
} from '../../redux/finance/finance-selectors';
import css from './balance.module.css';

const formatBalance = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function Balance() {
  const balance = useSelector(selectTotalBalance);
  const loading = useSelector(selectBalanceLoading);
  const error = useSelector(selectBalanceError);

  return (
    <section className={css.balance} aria-label="Your balance">
      <p className={css.label}>Your balance</p>
      {loading ? (
        <p role="status" className={css.amount}>
          Loading...
        </p>
      ) : error ? (
        <p role="alert" className={css.message}>
          Balance unavailable
        </p>
      ) : (
        <p className={css.amount}>₴ {formatBalance(balance)}</p>
      )}
    </section>
  );
}
