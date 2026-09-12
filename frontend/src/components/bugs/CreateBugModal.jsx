import { useRef, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";
import AvatarGroup from "../ui/AvatarGroup";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import { CreateBug } from "../../api/bug";
import { useToast } from "../../context/ToastContext";

export default function CreateBugModal({
  isOpen,
  onClose,
  projectId,
  developers,
  onCreated,
}) {
  const { showSuccess, showError } = useToast();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("bug");
  const [deadline, setDeadline] = useState("");
  const [assignedDevIds, setAssignedDevIds] = useState([]);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  function resetForm() {
    setTitle("");
    setDesc("");
    setType("bug");
    setDeadline("");
    setAssignedDevIds([]);
    setFile(null);
  }

  async function handleSubmit() {
    if (!title.trim()) return showError("Title is required");

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("desc", desc.trim());
      formData.append("type", type);
      formData.append("status", "new");

      if (deadline) {
        formData.append("deadline", deadline);
      }

      const selectedDevs = developers.filter((dev) =>
        assignedDevIds.includes(dev._id),
      );

      selectedDevs.forEach((dev) => formData.append("assignToDev", dev.email));

      if (file) {
        formData.append("img", file);
      }

      await CreateBug(projectId, formData);

      showSuccess("Bug added successfully");
      resetForm();
      onCreated();
      onClose();
    } catch (err) {
      showError(err.response?.data?.error || "Failed to create bug");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedDevs = developers.filter((dev) =>
    assignedDevIds.includes(dev._id),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="font-[Poppins] text-[27.35px] font-medium leading-[100%] tracking-[0%] text-[#000000]">
          Add new bug
        </span>
      }
      className="relative max-w-xl h-[550px]"
      footer={
        <Button
          className="ml-auto w-full sm:w-auto sm:min-w-[140px]"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-[Poppins] text-[16.28px] font-normal leading-[100%] tracking-[0%] text-[#000000]">
              Assign to
            </span>

            <div className="relative flex items-center">
              {selectedDevs.length > 0 && (
                <div className="relative z-20 mr-[-14px]">
                  <AvatarGroup users={selectedDevs} />
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAssignOpen((prev) => !prev)}
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#8D98AA] bg-white cursor-pointer"
                aria-label="Assign developers"
              >
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <img
                    src="/CreateBug/plusBadge.png"
                    alt="Add"
                    className="icon-color h-full w-full rounded-full object-contain"
                  />
                </span>
              </button>

              {isAssignOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-max">
                  <MultiSelectDropdown
                    options={developers}
                    selectedIds={assignedDevIds}
                    onChange={setAssignedDevIds}
                    open={isAssignOpen}
                    onOpenChange={setIsAssignOpen}
                    showTrigger={false}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-[Poppins] text-[16.28px] font-normal leading-[100%] tracking-[0%] text-[#000000]">
              Add due date
            </span>

            <div className="relative flex h-8 w-8 items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const el = dateInputRef.current;
                  if (!el) return;
                  if (typeof el.showPicker === "function") {
                    el.showPicker();
                  } else {
                    el.focus();
                    el.click();
                  }
                }}
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-[#8D98AA] bg-white cursor-pointer"
                aria-label="Add due date"
              >
                <img
                  src="/CreateBug/duedate.svg"
                  alt="Due date"
                  className="pointer-events-none h-4 w-4 object-contain"
                />
              </button>

              <input
                ref={dateInputRef}
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                tabIndex={-1}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
              />
            </div>

            {deadline && (
              <span className="text-body-small text-gray-500">{deadline}</span>
            )}
          </div>

          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-32 shrink-0"
            options={[
              { value: "bug", label: "Bug" },
              { value: "feature", label: "Feature" },
            ]}
          />
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add title here"
          className="w-full border-none bg-transparent font-[Poppins] text-[25px] font-medium leading-[100%] tracking-[0%] text-[#000000] placeholder:text-[#DFDEE0] outline-none"
        />

        <div>
          <label className="mb-5 block font-[Poppins] text-[16.28px] font-normal leading-[100%] tracking-[0%] text-[#000000]">
            Bug details
          </label>

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add here"
            rows={1}
            className="w-full resize-none rounded border border-gray-200 bg-gray-50 px-3.5 py-3 text-body-small text-gray-900 outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/gif"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-2 py-4 text-center">
          <img
            src="/CreateBug/upload.png"
            alt="Upload"
            className="h-6 w-6 object-contain"
          />

          <p className="text-body-small text-gray-400">
            {file ? (
              file.name
            ) : (
              <>
                Drop any file here or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary underline"
                >
                  browse
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-[15px] top-[15px] flex h-[40px] w-[40px] items-center justify-center rounded-[4.59px] bg-black text-xl leading-none text-white transition-transform duration-200 hover:scale-105"
        aria-label="Close"
      >
        ×
      </button>
    </Modal>
  );
}
