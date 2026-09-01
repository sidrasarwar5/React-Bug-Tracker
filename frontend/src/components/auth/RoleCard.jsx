import { cn } from "../../utils/cn";

export default function RoleCard({ label, description, icon: Icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4  border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-400"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
        )}
      >
        <Icon size={18} />
      </span>

      <span className="flex-1">
        <span className="block text-body2 font-semibold text-gray-900">{label}</span>
        <span className="block text-body-small text-gray-500">{description}</span>
      </span>
    </button>
  );
}