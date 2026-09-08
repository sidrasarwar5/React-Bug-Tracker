import { statusLabels } from "../../utils/labels";

const statusColors = {
  new: { bg: "bg-status-pending/10", text: "text-status-pending" },
  started: { bg: "bg-status-progress/10", text: "text-status-progress" },
  resolved: { bg: "bg-status-closed/10", text: "text-status-closed" },
  completed: { bg: "bg-status-closed/10", text: "text-status-closed" },
};

export default function Badge({ status }) {
  const colors = statusColors[status] || statusColors.new;
  const label = statusLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-body-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {label}
    </span>
  );
}