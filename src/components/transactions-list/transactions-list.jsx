import { useSelector } from 'react-redux';
import {
  selectCategories,
  selectTransactions,
} from '../../redux/finance/finance-selectors';
import TransactionsItem from '../transactions-item/transactions-item';
import css from './transactions-list.module.css';

export default function TransactionsList({ onEdit, onDelete }) {
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectCategories);
  const categoryNames = new Map(categories.map(({ id, name }) => [id, name]));

  if (transactions.length === 0) {
    return <p className={css.emptyMessage}>No transactions yet.</p>;
  }

  return (
    <section className={css.transactions} aria-label="Transactions">
      <div className={css.tableHeader} aria-hidden="true">
        <span>Date</span>
        <span>Type</span>
        <span>Category</span>
        <span>Comment</span>
        <span>Sum</span>
        <span />
      </div>
      <ul className={css.list}>
        {transactions.map((transaction) => (
          <li className={css.listItem} key={transaction.id}>
            <TransactionsItem
              transaction={transaction}
              categoryName={categoryNames.get(transaction.categoryId) ?? '—'}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
