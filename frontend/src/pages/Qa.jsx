import { useEffect, useState } from "react";
import { getProjects } from "../api/project";
import { Link } from "react-router-dom";

export default function QaPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.error || "Fail to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading projects...</p>
      </div>
    );
  }

  return (
  
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
          
        <h1 className="mb-6 text-3xl font-bold text-slate-900">QA Dashboard</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
 
  <div className="space-y-6">
  
          {projects.length === 0 ? (
            <p className="text-slate-500">No assigned projects yet.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
               <Link to= {`/projects/${project._id}`}>
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  {project.name}
                </h2>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}