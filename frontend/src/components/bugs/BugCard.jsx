import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import AvatarGroup from "../ui/AvatarGroup";
import DropdownMenu from "../ui/DropdownMenu";
import { buildBugMenuItems } from "../../utils/bugMenu";

const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

export default function BugCard({
  bug,
  onViewDetails,
  onStatusChange,
  onDelete,
  canChangeStatus,
  canDelete,
}) {
  const menuItems = buildBugMenuItems(bug, {
    onStatusChange,
    onDeleteRequest: () => onDelete(bug._id),
    canChangeStatus,
    canDelete,
  });

  const assignedNames = (bug.assignToDev || [])
    .map((dev) => dev.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      className="flex h-full flex-col gap-4 border"
      style={{ backgroundColor: "#F7FAFC" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col items-start gap-2">
          <h3 className="line-clamp-1 bug-title-card">
            {bug.title}
          </h3>
          <Badge status={bug.status} />
        </div>

        {menuItems.length > 0 && <DropdownMenu items={menuItems} />}
      </div>

      <div className="border-t border-gray-200" />

      <div className="flex-1 space-y-4 text-body-small">
        <div className="flex items-center justify-between">
          <span className="bug-subheading-card">Due Date</span>
          <span className="flex items-center gap-1.5 text-gray-900">
            <img
             src="/BugListingPage/dueDate.svg"
              alt="Due date"
              className="h-4 w-4 shrink-0 object-contain"
            />
            {formatDate(bug.deadline)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="bug-subheading-card ">Assigned To</span>
          <div className="flex items-center gap-2">
            <AvatarGroup users={bug.assignToDev} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <Button
        variant="secondary"
        onClick={() => onViewDetails(bug._id)}
        className="w-full btn-label"
      >
        View Details
      </Button>
    </Card>
  );
}