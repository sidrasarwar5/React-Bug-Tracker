import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/auth";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/project/PageHeader";
import ProjectGrid from "../components/project/ProjectGrid";
import AddProjectModal from "../components/project/AddProjectModal";
import AssignPeopleModal from "../components/project/AssignPeopleModal";
import { getProjects, createProject, deleteProject } from "../api/project";


export default function ProjectsDashboard() {
  const { user } = useAuth();
  const canManage = user?.user_type === "manager";

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const [activeProject, setActiveProject] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => project.name?.toLowerCase().includes(query));
  }, [projects, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCreate = async ({ name, description, logoFile }) => {
    try {
      setError("");
      const project = await createProject(name, description, logoFile);
      await loadProjects();

      setIsModalOpen(false);
      setActiveProject(project);
      setIsAssignModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
    }
  };

  const handleDelete = async (projectId) => {
    try {
      setError("");
      await deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete project");
    }
  };

  const handleAssignModalClose = () => {
    setIsAssignModalOpen(false);
    setActiveProject(null);
    loadProjects(); 
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Visnext Software Solutions"
          subtitle={`Hi ${user?.name || ""}, welcome to ManageBug`}
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search for Projects here"
          actionLabel={canManage ? "Add New Project" : undefined}
          onAction={canManage ? () => setIsModalOpen(true) : undefined}
        />

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-body-small text-status-pending">
            {error}
          </div>
        )}

        <ProjectGrid
          projects={filteredProjects}
          loading={loading}
          // QA/Developer get neither prop — ProjectCard simply won't
          // render delete/assign controls when these are undefined.
          onDelete={canManage ? handleDelete : undefined}
          onOpenAssign={
            canManage
              ? (project) => {
                  setActiveProject(project);
                  setIsAssignModalOpen(true);
                }
              : undefined
          }
        />
      </main>

      {/* Creation and assignment modals only ever render for managers */}
      {canManage && (
        <>
          <AddProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreate}
          />

          <AssignPeopleModal
            isOpen={isAssignModalOpen}
            project={activeProject}
            onClose={handleAssignModalClose}
          />
        </>
      )}
    </div>
  );
}