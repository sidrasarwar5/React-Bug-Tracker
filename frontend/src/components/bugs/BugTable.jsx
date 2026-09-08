import Badge from "../ui/Badge";
import AvatarGroup from "../ui/AvatarGroup";
import DropdownMenu from "../ui/DropdownMenu";
import { buildBugMenuItems } from "../../utils/bugMenu";

const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

const STATUS_DOT_COLORS = {
  new: "#EC5962",
  started: "#3069FE",
  resolved: "#00B894",
};

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
              <th className="whitespace-nowrap px-4 py-3 heading-label">
                Bug Details
              </th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">
                Due Date
              </th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">
                Assigned To
              </th>
              <th className="whitespace-nowrap px-4 py-3 heading-label">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bugs.map((bug) => {
              const menuItems = buildBugMenuItems(bug, {
                onStatusChange,
                onDeleteRequest: () => onDelete(bug._id),
                canChangeStatus: canChangeStatus(bug),
                canDelete: canDelete(bug),
              });

              return (
                <tr
                  key={bug._id}
                  className="cursor-pointer text-body-small hover:bg-gray-50"
                  onClick={() => onViewDetails(bug._id)}
                >
                  <td className="max-w-0 px-4 py-3">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            STATUS_DOT_COLORS[bug.status] || "#9CA3AF",
                        }}
                      />
                      <span className="bug-title truncate">{bug.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={bug.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <img
                      src="/BugListingPage/dueDate.svg"
                      alt="Due date"
                      title={formatDate(bug.deadline)}
                      className="h-4 w-4 shrink-0 object-contain"
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
