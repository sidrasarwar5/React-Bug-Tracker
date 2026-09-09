import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import PeopleSearchSelect from "./PeopleSearchSelect";
import { assignToProject } from "../../api/project";

export default function AssignPeopleModal({ isOpen, onClose, project }) {
  const [assignedQas, setAssignedQas] = useState([]);
  const [assignedDevs, setAssignedDevs] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setAssignedQas([]);
    setAssignedDevs([]);
    setError("");
    onClose();
  }

  async function handleSubmit() {
    if (!project?._id || submitting) return;
    if (assignedQas.length === 0 && assignedDevs.length === 0) {
      handleClose();
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await Promise.all([
        ...assignedQas.map((u) => assignToProject(project._id, u.email, "qa")),
        ...assignedDevs.map((u) =>
          assignToProject(project._id, u.email, "developer")
        ),
      ]);

      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to assign people");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Assign to ${project?.name || "project"}`}
      footer={
        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Assigning..." : "Confirm"}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-6">
        <div className="space-y-2">
          <label className="block text-body-small font-medium text-gray-800">
            Assign QA
          </label>
          <PeopleSearchSelect
            selected={assignedQas}
            onChange={setAssignedQas}
            userType="qa"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-body-small font-medium text-gray-800">
            Assign Developers
          </label>
          <PeopleSearchSelect
            selected={assignedDevs}
            onChange={setAssignedDevs}
            userType="developer"
          />
        </div>

        {error && (
          <p className="text-body-small text-status-pending">{error}</p>
        )}
      </div>
    </Modal>
  );
}