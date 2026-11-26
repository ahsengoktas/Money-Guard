import Modal from '../modal/modal';
import AddTransactionForm from '../add-transaction-form/add-transaction-form';

export default function ModalAddTransaction({
  categories,
  onSubmit,
  onClose,
  busy,
}) {
  return (
    <Modal title="Add transaction" onClose={onClose} busy={busy}>
      <AddTransactionForm
        categories={categories}
        onSubmit={onSubmit}
        onCancel={onClose}
        busy={busy}
      />
    </Modal>
  );
}
