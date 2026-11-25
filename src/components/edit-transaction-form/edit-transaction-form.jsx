import TransactionForm from '../transaction-form/transaction-form';

export default function EditTransactionForm({ transaction, ...props }) {
  return (
    <TransactionForm
      {...props}
      initialTransaction={transaction}
      submitLabel="Save"
    />
  );
}
