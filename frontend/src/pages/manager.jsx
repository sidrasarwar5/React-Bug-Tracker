import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProjects,
  createProject,
  assignToProject,
  deleteProject,
} from "../api/project";

export default function ManagerPage() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("qa");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    try {
      await createProject(projectName);

      setProjectName("");

      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
    }
  }

  async function handleAssign(projectId) {
    if (!email.trim()) {
      return;
    }

    try {
      await assignToProject(projectId, email, role);

      setEmail("");
      setRole("qa");

      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to assign user");
    }
  }

  async function handleDelete(projectId) {
    try {
      await deleteProject(projectId);

      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete project");
    }
  }

  if (loading) {
    return <div className="p-8">Loading projects...</div>;
  }
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          Manager Dashboard
        </h1>
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
          >
            Create Project
          </button>
        </form>
        {projects.length === 0 ? (
          <p className="text-slate-500">No projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                 <Link to= {`/projects/${project._id}/bugs`}>
                  <h2 className="text-xl font-bold text-slate-900">
                    {project.name}
                  </h2>
</Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-sm font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <div className="mb-2 text-sm text-slate-600">
                  <p>
                    <b>QAs:</b>{" "}
                    {project.assignedqas?.length > 0
                      ? project.assignedqas.map((qa) => qa.email).join(", ")
                      : "None"}
                  </p>
                </div>

                <div className="mb-4 text-sm text-slate-600">
                  <p>
                    <b>Developers:</b>{" "}
                    {project.assigneddeveloper?.length > 0
                      ? project.assigneddeveloper
                          .map((dev) => dev.email)
                          .join(", ")
                      : "None"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="User email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="qa">QA</option>

                    <option value="developer">Developer</option>
                  </select>

                  <button
                    onClick={() => handleAssign(project._id)}
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
