import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/auth";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/manager/PageHeader";
import ProjectGrid from "../components/manager/ProjectGrid";
import AddProjectModal from "../components/manager/AddProjectModal";
import {
  getProjects,
  createProject,
  assignToProject,
  deleteProject,
} from "../api/project";

export default function ManagerPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) =>
      project.name?.toLowerCase().includes(query)
    );
  }, [projects, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCreate = async ({ name, description }) => {
    try {
      setError("");

      await createProject(name, description);
      await loadProjects();

      setIsModalOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create project"
      );
    }
  };

  const handleAssign = async (projectId, email, role) => {
    try {
      setError("");

      await assignToProject(projectId, email, role);
      await loadProjects();
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to assign user"
      );
    }
  };

  const handleDelete = async (projectId) => {
    try {
      setError("");

      await deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to delete project"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Visnext Software Solutions"
          subtitle={`Hi ${user?.name || ""}, welcome to ManageBug`}
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search for Projects here"
          actionLabel="Add New Project"
          onAction={() => setIsModalOpen(true)}
        />

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-body-small text-status-pending">
            {error}
          </div>
        )}

        <ProjectGrid
          projects={filteredProjects}
          loading={loading}
          onAssign={handleAssign}
          onDelete={handleDelete}
        />
      </main>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}