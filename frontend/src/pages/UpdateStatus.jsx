import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BugDetail, UpdateStatus } from "../api/bug";
import { useAuth } from "../context/auth"

export default function UpdateStatusPage() {
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

  async function handleUpdateStatus(e) {
    e.preventDefault();

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
    return <div className="p-8">Loading bug...</div>;
  }

  if (error && !bug) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!bug) {
    return <div className="p-8">Bug not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">{bug.title}</h1>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {bug.status}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Description
              </p>

              <p className="mt-1 text-slate-800">
                {bug.desc || "No description"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">Type</p>

              <p className="mt-1 text-slate-800">{bug.type}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">Deadline</p>

              <p className="mt-1 text-slate-800">
                {new Date(bug.deadline).toLocaleDateString() || "No deadline"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Time Passed
              </p>

              <p className="mt-1 text-slate-800">{bug.time_passed || "N/A"}</p>
            </div>

           
            <div>
              <p className="text-sm font-semibold text-slate-500">Stale</p>

              <p className="mt-1 text-slate-800">{bug.stale ? "Yes" : "No"}</p>
            </div>

          {bug.img ? (
  <img
    src={`http://localhost:3000/uploads/${bug.img}`}
    alt={bug.title}
    className="mt-2 max-h-96 rounded-xl border"
  />
) : (
  <p className="mt-2 text-slate-500">
    No image uploaded
  </p>
)}
          </div>
        </div>
{user.user_type === "developer" && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Update Bug Status
          </h2>

          <form onSubmit={handleUpdateStatus} className="grid gap-3">
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">new</option>

              <option value="started">started</option>

              {bug.type === "feature" ? (
                <option value="completed">completed</option>
              ) : (
                <option value="resolved">resolved</option>
              )}
            </select>

            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </form>
        </div>
         )}
      </div>
     
    </div>
  );
}
