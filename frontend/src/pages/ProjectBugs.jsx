import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectBugs } from "../api/bug";
import { Link } from "react-router-dom";
import { getProjects } from "../api/project";

const ProjectBugsPage = () => {
  const { projectId } = useParams();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBugs() {
    try {
      setLoading(true);
      setError("");

      const data = await getProjectBugs(projectId);

      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to load bugs for this project"
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

  if (loading) {
    return (
      <div className="p-8">
        Loading bugs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Project Bugs
        </h2>

        {bugs.length === 0 ? (
          <p className="text-slate-500">
            No bugs reported for this project yet.
          </p>
        ) : (
          <div className="space-y-3">
         
            {bugs.map((bug) => (
              <div
                key={bug._id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <Link to= {`/projects/${projectId}/bugs/${bug._id}`}>
                <div className="flex items-center justify-between">

                  <p className="font-semibold text-slate-900">
                    {bug.title}
                  </p>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {bug.status}
                  </span>

                </div>

                

                <div className="mt-2 text-xs text-slate-400">
                  Type: {bug.type}
                </div>
</Link>
              </div>
          
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectBugsPage;