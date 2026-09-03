import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import { CreateBug } from "../../api/bug";

export default function CreateBugModal({ isOpen, onClose, projectId, developers, onCreated }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("bug");
  const [deadline, setDeadline] = useState("");
  const [assignedDevIds, setAssignedDevIds] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function resetForm() {
    setTitle("");
    setDesc("");
    setType("bug");
    setDeadline("");
    setAssignedDevIds([]);
    setFile(null);
    setError("");
  }

  async function handleSubmit() {
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("desc", desc.trim());
      formData.append("type", type);
      formData.append("status", "new");
      if (deadline) formData.append("deadline", deadline);

      const selectedDevs = developers.filter((dev) =>
        assignedDevIds.includes(dev._id),
      );
      selectedDevs.forEach((dev) => formData.append("assignToDev[]", dev.email));

      if (file) formData.append("img", file);

      await CreateBug(projectId, formData);
      resetForm();
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create bug");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new bug">
      <div className="flex items-center gap-4">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-32 shrink-0"
          options={[
            { value: "bug", label: "Bug" },
            { value: "feature", label: "Feature" },
          ]}
        />

        <MultiSelectDropdown
          options={developers}
          selectedIds={assignedDevIds}
          onChange={setAssignedDevIds}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-body-small text-gray-700"
        />
      </div>

      <div className="mt-4 space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add title"
        />

        <div>
          <label className="mb-1.5 block text-body-small font-medium text-gray-800">
            Bug details
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add here"
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-body-small text-gray-900 outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/gif"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-4 text-body-small text-gray-400"
        >
          <ImagePlus size={18} />
          {file ? file.name : "Drop any file here or browse"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-body-small text-status-pending">{error}</p>
      )}

      <div className="mt-6 flex gap-3">
        <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Adding..." : "Add"}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}