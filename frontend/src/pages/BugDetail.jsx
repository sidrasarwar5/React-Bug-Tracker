import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BugDetail, UpdateStatus } from "../api/bug";
import { useAuth } from "../context/auth";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/manager/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";

export default function BugDetailPage() {
  const { projectId, bugId } = useParams();
  const { user } = useAuth();

  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

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

  async function handleUpdateStatus() {
    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const data = await UpdateStatus(projectId, bugId, status);

      setBug(data);
      setStatus(data.status);
      setMessage(`Status updated to "${data.status}"`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update bug status");
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader title="Bug Detail" showSearch={false} />

        {error && (
          <div className="mb-6 rounded-lg bg-status-pending/10 p-3 text-body-small text-status-pending">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg bg-status-closed/10 p-3 text-body-small text-status-closed">
            {message}
          </div>
        )}

        {canChangeStatus && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="sm:w-48"
              options={[
                { value: "new", label: "New" },
                { value: "started", label: "Started" },
                bug.type === "feature"
                  ? { value: "completed", label: "Completed" }
                  : { value: "resolved", label: "Resolved" },
              ]}
            />

            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? "Updating..." : "Update Status"}
            </Button>
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between">
            <h1 className="text-h2 font-semibold text-gray-900">{bug.title}</h1>
            <Badge status={bug.status} />
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Description
              </p>
              <p className="mt-1 text-body2 text-gray-900">
                {bug.desc || "No description"}
              </p>
            </div>

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
    Assigned QA
  </p>

  <div className="mt-2">
    {bug.reporter ? (
      <div className="flex items-center gap-2">
        <Avatar name={bug.reporter.name} size="sm" />

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
                      <Avatar name={dev.name} size="sm" />
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
                Time Passed
              </p>
              <p className="mt-1 text-body2 text-gray-900">
                {bug.time_passed || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-body-small font-semibold text-gray-500">
                Stale
              </p>
              <p className="mt-1 text-body2 text-gray-900">
                {bug.stale ? "Yes" : "No"}
              </p>
            </div>

            {bug.img ? (
              <img
                src={`http://localhost:3000/uploads/${bug.img}`}
                alt={bug.title}
                className="mt-2 max-h-96 rounded-xl border border-gray-200"
              />
            ) : (
              <p className="mt-2 text-body-small text-gray-500">
                No image uploaded
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
