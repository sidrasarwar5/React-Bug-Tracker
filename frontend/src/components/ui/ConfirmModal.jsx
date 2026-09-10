import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="px-6 pb-6 pt-2">
        <p className="text-body-small text-gray-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <Button variant="primary" className="flex-1" onClick={onConfirm}>
            Delete
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
