import Modal from '../modal/modal';
import EditTransactionForm from '../edit-transaction-form/edit-transaction-form';

export default function ModalEditTransaction({
  transaction,
  categories,
  onSubmit,
  onClose,
  busy,
}) {
  return (
    <Modal title="Edit transaction" onClose={onClose} busy={busy}>
      <EditTransactionForm
        transaction={transaction}
        categories={categories}
        onSubmit={onSubmit}
        onCancel={onClose}
        busy={busy}
      />
    </Modal>
  );
}
