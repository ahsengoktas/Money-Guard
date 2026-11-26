import TransactionForm from '../transaction-form/transaction-form';

export default function AddTransactionForm(props) {
  return <TransactionForm {...props} submitLabel="Add" />;
}
