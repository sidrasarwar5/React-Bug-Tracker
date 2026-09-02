import { statusLabels } from "./labels";

const statusColorMap = {
  new: "bg-status-pending",
  started: "bg-status-progress",
  resolved: "bg-status-closed",
  completed: "bg-status-closed",
};

export function getBugStatusOptions(bug) {
  return bug.type === "bug"
    ? ["new", "started", "resolved"]
    : ["new", "started", "completed"];
}

export function buildBugMenuItems(bug, { onStatusChange, onDelete, canChangeStatus, canDelete }) {
  const items = [];

  if (canChangeStatus) {
    items.push(
      { type: "header", label: "Change Status" },
      ...getBugStatusOptions(bug).map((status) => ({
        label: statusLabels[status],
        color: statusColorMap[status],
        onClick: () => onStatusChange(bug._id, status),
      }))
    );
  }

  if (canDelete) {
    if (items.length > 0) items.push({ type: "divider" });
    items.push({ label: "Delete", danger: true, onClick: () => onDelete(bug._id) });
  }

  return items;
}