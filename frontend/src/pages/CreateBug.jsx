import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectBugs, CreateBug } from "../api/bug";
import { getProjects } from "../api/project";
import { Link } from "react-router-dom";

export default function CreateBugPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("feature");
  const [deadline, setDeadline] = useState("");
  const [assignToDev, setAssignToDev] = useState("");
  const [file, setFile] = useState(null);

  async function loadProject() {
    try {
      setLoading(true);

      const data = await getProjects();

      const currentProject = data.find((project) => project._id === projectId);

      setProject(currentProject);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  async function loadBugs() {
    try {
      setLoading(true);
      setError("");
      const data = await getProjectBugs(projectId);
      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load bugs for this project",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      loadBugs();
    }
  }, [projectId]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("type", type);
      formData.append("status", "new");
      if (deadline) formData.append("deadline", deadline);
      if (assignToDev) formData.append("assignToDev", assignToDev);
      if (file) formData.append("img", file);

      await CreateBug(projectId, formData);

      setTitle("");
      setDesc("");
      setType("feature");
      setDeadline("");
      setAssignToDev("");
      setFile(null);

      loadBugs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create bug");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && bugs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          Create & Manage Bugs and feature
        </h1>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Create</h2>

          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
            />

            <textarea
              placeholder="Description"
              required
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
            />

            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="feature">feature</option>
              <option value="bug">bug</option>
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />

            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={assignToDev || ""}
              onChange={(e) => setAssignToDev(e.target.value)}
            >
              <option value="">Select developer</option>
              {project.assigneddeveloper?.map((dev) => (
                <option key={dev._id} value={dev.email}>
                  {dev.name} ({dev.email})
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 sm:col-span-2 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2"
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Project Bugs</h2>

          {bugs.length === 0 && !loading && (
            <p className="text-slate-500">
              No bugs reported for this project yet.
            </p>
          )}

          {bugs.map((bug) => (
            <div
              key={bug._id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <Link to={`/projects/${projectId}/bugs/${bug._id}`}>
                  <p className="font-semibold text-slate-900">{bug.title}</p>
                </Link>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {bug.status}
                </span>
              </div>
              {bug.desc && (
                <p className="mt-2 text-sm text-slate-600">{bug.desc}</p>
              )}
              <div className="mt-2 text-xs text-slate-400">
                <span>Type: {bug.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
