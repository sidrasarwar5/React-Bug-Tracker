import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { assignToProject } from "../../api/project";

export default function AssignPeopleModal({ isOpen, onClose, project }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("qa");
  const [assigned, setAssigned] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setEmail("");
    setRole("qa");
    setAssigned([]);
    setError("");
    onClose();
  }

  async function handleAdd() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !project?._id) return;

    setError("");
    setSubmitting(true);

    try {
      await assignToProject(project._id, trimmedEmail, role);

      setAssigned((prev) => [
        ...prev,
        {
          email: trimmedEmail,
          role,
        },
      ]);

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to assign"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Assign to ${project?.name || "project"}`}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-body-small font-medium text-gray-800">
            Email
          </label>

          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1"
              error={error}
            />

            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-32 shrink-0"
              options={[
                { value: "qa", label: "QA" },
                { value: "developer", label: "Developer" },
              ]}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-2 w-full"
            onClick={handleAdd}
            disabled={submitting || !email.trim()}
          >
            {submitting ? "Assigning..." : "Add"}
          </Button>
        </div>

        {assigned.length > 0 && (
          <div className="space-y-1.5">
            {assigned.map((person) => (
              <div
                key={`${person.email}-${person.role}`}
                className="flex items-center gap-2 rounded-lg bg-status-closed/10 px-3 py-2 text-body-small text-gray-800"
              >
                <Check size={14} className="text-status-closed" />

                {person.email}

                <span className="text-gray-400">
                  ({person.role})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleClose}
        >
          {assigned.length > 0 ? "Done" : "Skip for now"}
        </Button>
      </div>
    </Modal>
  );
}

