import { useState } from "react";
import { ImagePlus } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";


export default function AddProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
    setAssignTo("");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new Project">
      <div className="space-y-4">
        <Input
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
        />

        <Input
          label="Short details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter details here"
        />

        <div>
          <label className="mb-1.5 block text-body-small font-medium text-gray-800">
            Assign to
          </label>
          <select
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-body-small text-gray-900 outline-none focus:border-primary"
          >
            <option value="">Select role</option>
            <option value="qa">QA</option>
            <option value="developer">Developer</option>
          </select>
        </div>

        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 py-6 text-gray-400"
        >
          <ImagePlus size={20} />
          <span className="text-body-xs">Upload logo</span>
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1" onClick={handleSubmit}>
          Add
        </Button>
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
