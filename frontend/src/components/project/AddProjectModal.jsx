import { useRef, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PeopleSearchSelect from "./PeopleSearchSelect";

export default function AddProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedQas, setAssignedQas] = useState([]);
  const [assignedDevs, setAssignedDevs] = useState([]);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function resetForm() {
    setName("");
    setDescription("");
    setAssignedQas([]);
    setAssignedDevs([]);
    setLogoFile(null);
    setLogoPreview(null);
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!name.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        logoFile,
        assignedQaIds: assignedQas.map((u) => u._id),
        assignedDevIds: assignedDevs.map((u) => u._id),
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className="addproject-heading">Add new Project</span>}
      className="max-w-xl "
      footer={
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add"}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <label className="addproject-label">Add project</label>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
          />
          <label className="addproject-label">Short details</label>

          <Input
            label="Short details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            
            placeholder="Enter details here"
          />
          <div className="space-y-2">
            <label className="block addproject-label">Assign QA</label>
            <PeopleSearchSelect
              selected={assignedQas}
              onChange={setAssignedQas}
              userType="qa"
            />
          </div>

          <div className="space-y-2">
            <label className="block addproject-label">Assign Developers</label>
            <PeopleSearchSelect
              selected={assignedDevs}
              onChange={setAssignedDevs}
              userType="developer"
            />
          </div>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-gray-400"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <>
                <img
                  src="/Addproject/addLogo.svg"
                  alt=""
                  className="h-6 w-6 object-contain"
                />
                <span className="text-body-xs">Upload logo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
