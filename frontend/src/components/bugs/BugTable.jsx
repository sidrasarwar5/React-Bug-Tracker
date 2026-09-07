import Badge from "../ui/Badge";
import AvatarGroup from "../ui/AvatarGroup";
import DropdownMenu from "../ui/DropdownMenu";
import { Calendar } from "lucide-react";
import { buildBugMenuItems } from "../../utils/bugMenu";

const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

export default function BugTable({
  bugs,
  loading,
  onViewDetails,
  onStatusChange,
  onDelete,
  canChangeStatus,
  canDelete,
}) {
  if (loading) {
    return <p className="text-body-small text-gray-500">Loading bugs...</p>;
  }

  if (bugs.length === 0) {
    return (
      <p className="text-body-small text-gray-500">
        No bugs reported for this project yet.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="custom-scrollbar overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[640px] table-fixed text-left lg:min-w-full">
          <colgroup>
            <col className="w-80" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-28" />
            <col className="w-16" />
          </colgroup>

          <thead className="border-b border-gray-200 bg-gray-100">
            <tr className="text-body-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="whitespace-nowrap px-4 py-3 heading-label">Bug Details</th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">Status</th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">Due Date</th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">Assigned To</th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bugs.map((bug) => {
              const menuItems = buildBugMenuItems(bug, {
                onStatusChange,
                onDelete,
                canChangeStatus: canChangeStatus(bug),
                canDelete: canDelete(bug),
              });

              return (
                <tr
                  key={bug._id}
                  className="cursor-pointer text-body-small hover:bg-gray-50"
                  onClick={() => onViewDetails(bug._id)}
                >
                  <td className="max-w-0 truncate px-4 py-3 text-gray-900">
                    {bug.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={bug.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <Calendar
                      size={16}
                      className="shrink-0"
                      title={formatDate(bug.deadline)}
                    />
                  </td>
                  <td className="overflow-hidden px-4 py-3">
                    <AvatarGroup users={bug.assignToDev} />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {menuItems.length > 0 && <DropdownMenu items={menuItems} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
