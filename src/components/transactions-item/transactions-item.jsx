import css from './transactions-item.module.css';

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  }).format(date);
};

const formatAmount = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(Number(value)));

export default function TransactionsItem({ transaction, categoryName, onEdit, onDelete }) {
  const { transactionDate, type, comment, amount } = transaction;
  const isIncome = type === 'INCOME';
  const fields = [
    ['Date', formatDate(transactionDate)],
    ['Type', isIncome ? '+' : '−'],
    ['Category', categoryName],
    ['Comment', comment || '—'],
    ['Sum', formatAmount(amount)],
  ];

  return (
    <div className={`${css.transaction} ${isIncome ? css.income : css.expense}`}>
      {fields.map(([label, value]) => (
        <div className={css.field} key={label}>
          <span className={css.label}>{label}</span>
          <span className={css.value}>{value}</span>
        </div>
      ))}
      <div className={css.actions}>
        <button
          className={css.editButton}
          type="button"
          disabled={!onEdit}
          onClick={() => onEdit?.(transaction)}
          aria-label="Edit transaction"
        >
          <svg width="13" height="13" aria-hidden="true">
            <use href={`${import.meta.env.BASE_URL}icons.svg#icon-edit`} />
          </svg>
          <span className={css.editText}>Edit</span>
        </button>
        <button
          className={css.deleteButton}
          type="button"
          disabled={!onDelete}
          onClick={() => onDelete?.(transaction.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
