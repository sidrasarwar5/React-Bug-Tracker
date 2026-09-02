import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import AvatarGroup from "../ui/AvatarGroup";
import DropdownMenu from "../ui/DropdownMenu";
import { Calendar } from "lucide-react";
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
  const menuItems = buildBugMenuItems(bug, { onStatusChange, onDelete, canChangeStatus, canDelete });

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-body2 font-semibold text-gray-900">{bug.title}</h3>
          <Badge status={bug.status} />
        </div>

        {menuItems.length > 0 && <DropdownMenu items={menuItems} />}
      </div>

      <div className="space-y-2 text-body-small">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Due Date</span>
          <span className="flex items-center gap-1.5 text-gray-700">
            <Calendar size={14} />
            {formatDate(bug.deadline)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Assigned To</span>
          <AvatarGroup users={bug.assignToDev} />
        </div>
      </div>

      <Button variant="secondary" onClick={() => onViewDetails(bug._id)} className="w-full">
        View Details
      </Button>
    </Card>
  );
}