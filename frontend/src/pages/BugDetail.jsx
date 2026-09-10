import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BugDetail, UpdateStatus } from "../api/bug";
import { useAuth } from "../context/auth";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/project/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import DropdownMenu from "../components/ui/DropdownMenu";
import { buildBugMenuItems } from "../utils/bugMenu";
import { statusLabels } from "../utils/labels";

export default function BugDetailPage() {
  const { projectId, bugId } = useParams();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadBug() {
      try {
        setLoading(true);
        setError("");

        const data = await BugDetail(projectId, bugId);

        setBug(data);
        setStatus(data.status);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load bug details");
      } finally {
        setLoading(false);
      }
    }

    if (projectId && bugId) {
      loadBug();
    }
  }, [projectId, bugId]);

  async function handleUpdateStatus(_bugId, newStatus) {
    try {
      setUpdating(true);

      const data = await UpdateStatus(projectId, bugId, newStatus);

      setBug((prev) => ({ ...prev, status: data.status }));
      setStatus(data.status);
      showSuccess(
        `Status updated to "${statusLabels[data.status] || data.status}"`,
      );
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update bug status");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-body-small text-gray-500">Loading bug...</div>
    );
  }

  if (error && !bug) {
    return (
      <div className="p-8 text-body-small text-status-pending">{error}</div>
    );
  }

  if (!bug) {
    return (
      <div className="p-8 text-body-small text-gray-500">Bug not found</div>
    );
  }

  const assignedDevs = bug.assignToDev || [];
  const canChangeStatus =
    user?.user_type === "developer" &&
    assignedDevs.some((dev) => dev._id === user.userId);

  const createdLabel = bug.createdAt
    ? new Date(bug.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const menuItems = buildBugMenuItems(bug, {
    onStatusChange: handleUpdateStatus,
    onDeleteRequest: () => {},
    canChangeStatus,
    canDelete: false,
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader title="Bug Detail" largeTitle={true} showSearch={false} />

        <Card>
          {/* Top row: status badge + created date — same Change Status menu as BugCard */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Badge status={status} />
              {menuItems.length > 0 && <DropdownMenu items={menuItems} />}
            </div>

            {createdLabel && (
              <div className="text-right">
                <p className="text-body-small font-semibold uppercase tracking-wide text-gray-400">
                  Created
                </p>
                <p className="text-body-small text-gray-500">{createdLabel}</p>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-h2 font-semibold text-gray-900">
            {bug.title}
          </h1>

          {/* Image area */}
          <div className="mt-4">
            {bug.img ? (
              <img
                src={bug.img}
                alt={bug.title}
                className="max-h-96 w-full rounded-xl border border-gray-200 object-contain"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 text-body-small text-gray-400">
                No image uploaded
              </div>
            )}
          </div>

          {/* Bug details */}
          <div className="mt-6">
            <p className="text-body-small font-semibold text-gray-500">
              Bug details
            </p>
            <div className="mt-1 rounded-lg border border-gray-200 p-3 text-body2 text-gray-900">
              {bug.desc || "No description"}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Type
              </p>
              <p className="mt-1 text-body2 text-gray-900 capitalize">
                {bug.type}
              </p>
            </div>

            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Time Passed
              </p>
              <p className="mt-1 text-body2 text-gray-900">
                {bug.time_passed || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Reported By
              </p>
              <div className="mt-2">
                {bug.reporter ? (
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={bug.reporter.name}
                      src={bug.reporter.avatarUrl}
                      size="sm"
                    />
                    <span className="text-body2 text-gray-900">
                      {bug.reporter.name} ({bug.reporter.email})
                    </span>
                  </div>
                ) : (
                  <span className="text-body-small text-gray-400">
                    Not assigned
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Assigned Developers
              </p>
              <div className="mt-2 space-y-2">
                {assignedDevs.length > 0 ? (
                  assignedDevs.map((dev) => (
                    <div key={dev._id} className="flex items-center gap-2">
                      <Avatar name={dev.name} src={dev.avatarUrl} size="sm" />
                      <span className="text-body2 text-gray-900">
                        {dev.name} ({dev.email})
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-body-small text-gray-400">
                    Not assigned
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Stale
              </p>
              <p className="mt-1 text-body2 text-gray-900">
                {bug.stale ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}