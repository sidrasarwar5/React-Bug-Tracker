import { statusLabels } from "./labels";

const statusBgMap = {
  new: "bg-status-pending/10",
  started: "bg-status-progress/10",
  resolved: "bg-status-closed/10",
  completed: "bg-status-closed/10",
};

const statusTextMap = {
  new: "text-status-pending",
  started: "text-status-progress",
  resolved: "text-status-closed",
  completed: "text-status-closed",
};

const STATUS_ORDER_BY_TYPE = {
  bug: ["new", "started", "resolved"],
  feature: ["new", "started", "completed"],
};

export function getBugStatusOptions(bug) {
  const order =
    bug.type === "bug"
      ? STATUS_ORDER_BY_TYPE.bug
      : STATUS_ORDER_BY_TYPE.feature;

  const currentIndex = order.indexOf(bug.status);
  if (currentIndex === -1) return order;
  return order.filter((_, idx) => idx >= currentIndex);
}

export function buildBugMenuItems(
  bug,
  { onStatusChange, onDeleteRequest, canChangeStatus, canDelete },
) {
  const items = [];

  if (canChangeStatus) {
    items.push(
      {
        type: "header",
        label: "Change Status",
        className: "px-4 py-1.5 status-header",
      },
      ...getBugStatusOptions(bug).map((status) => ({
        label: statusLabels[status],
        bg: statusBgMap[status],
        color: statusTextMap[status],
        onClick: () => onStatusChange(bug._id, status),
      })),
    );
  }

  if (canDelete) {
    if (items.length > 0) items.push({ type: "divider" });
    items.push({
      label: "Delete",
      danger: true,
      icon: "/delete.svg",
      onClick: () => onDeleteRequest(bug),
    });
  }

  return items;
}
