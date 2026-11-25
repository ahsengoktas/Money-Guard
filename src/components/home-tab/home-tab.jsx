import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  fetchBalance,
  fetchCategories,
  fetchTransactions,
} from '../../redux/finance/finance-operations';
import {
  selectCategories,
  selectFinanceError,
  selectFinanceLoading,
  selectFinanceMutating,
} from '../../redux/finance/finance-selectors';
import Balance from '../balance/balance';
import ButtonAddTransactions from '../button-add-transactions/button-add-transactions';
import ModalAddTransaction from '../modal-add-transaction/modal-add-transaction';
import ModalEditTransaction from '../modal-edit-transaction/modal-edit-transaction';
import TransactionsList from '../transactions-list/transactions-list';
import css from './home-tab.module.css';

// DashboardPage içerisinde HomeTab bileşeni kullanılmalıdır.
// Balance, işlem listesi, ekleme butonu ve modallar bu bileşene dahildir.
export default function HomeTab() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectFinanceLoading);
  const isMutating = useSelector(selectFinanceMutating);
  const error = useSelector(selectFinanceError);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    dispatch(fetchBalance());
  }, [dispatch]);

  const refreshFinancialData = () => {
    dispatch(fetchTransactions());
    dispatch(fetchBalance());
  };

  const handleAdd = async (values) => {
    await dispatch(addTransaction(values)).unwrap();
    setAddOpen(false);
    refreshFinancialData();
  };

  const handleEdit = async (values) => {
    await dispatch(editTransaction({ id: editing.id, values })).unwrap();
    setEditing(null);
    refreshFinancialData();
  };

  const handleDelete = async (id) => {
    if (isMutating || !window.confirm('Delete this transaction?')) return;
    setActionError('');
    try {
      await dispatch(deleteTransaction(id)).unwrap();
      refreshFinancialData();
    } catch (message) {
      setActionError(String(message));
    }
  };

  return (
    <section className={css.home} aria-label="Home transactions">
      <Balance />
      {actionError && (
        <p role="alert" className={css.error}>
          {actionError}
        </p>
      )}
      {isLoading ? (
        <p role="status" className={css.status}>
          Loading transactions...
        </p>
      ) : error ? (
        <p role="alert" className={css.error}>
          {String(error)}
        </p>
      ) : (
        <TransactionsList
          onEdit={isMutating ? undefined : setEditing}
          onDelete={isMutating ? undefined : handleDelete}
        />
      )}
      <ButtonAddTransactions
        onClick={() => setAddOpen(true)}
        disabled={isMutating}
      />
      {addOpen && (
        <ModalAddTransaction
          categories={categories}
          onSubmit={handleAdd}
          onClose={() => setAddOpen(false)}
          busy={isMutating}
        />
      )}
      {editing && (
        <ModalEditTransaction
          transaction={editing}
          categories={categories}
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
          busy={isMutating}
        />
      )}
    </section>
  );
}
