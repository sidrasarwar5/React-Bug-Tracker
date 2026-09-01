import { statusLabels } from "../../utils/labels";

const statusColors = {
  new: { dot: "bg-red-500", text: "text-red-600" },
  started: { dot: "bg-blue-500", text: "text-blue-600" },
  resolved: { dot: "bg-green-500", text: "text-green-600" },
  completed: { dot: "bg-green-500", text: "text-green-600" },
};

export default function Badge({ status }) {
  const colors = statusColors[status] || statusColors.new;
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 text-body-small font-medium ${colors.text}`}>
      <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}