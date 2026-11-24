import css from './button-add-transactions.module.css';

export default function ButtonAddTransactions({ onClick, disabled = false }) {
  return (
    <button
      className={css.button}
      type="button"
      aria-label="Add transaction"
      onClick={onClick}
      disabled={disabled}
    >
      +
    </button>
  );
}
