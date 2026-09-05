import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AddProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function resetForm() {
    setName("");
    setDescription("");
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
      await onCreate({ name: name.trim(), description: description.trim(), logoFile });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new Project" size="lg">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
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
              <img src={logoPreview} alt="Logo preview" className="h-full w-full rounded-lg object-cover" />
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-body-xs">Upload logo</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Adding..." : "Add"}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}