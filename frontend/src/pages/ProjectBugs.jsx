import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import { getProjectBugs, UpdateStatus, DeleteBug } from "../api/bug";
import { getProjects } from "../api/project";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/manager/PageHeader";
import BugsToolbar from "../components/bugs/BugsToolbar";
import BugGrid from "../components/bugs/BugGrid";
import BugTable from "../components/bugs/BugTable";
import CreateBugModal from "../components/bugs/CreateBugModal";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function ProjectBugsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [assignedTo, setAssignedTo] = useState("all");
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugToDelete, setBugToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadProject = async () => {
    try {
      const data = await getProjects();
      setProject(data.find((p) => p._id === projectId) || null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load project");
    }
  };

  const loadBugs = async () => {
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
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadBugs();
    }
  }, [projectId]);

  const filteredBugs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bugs.filter((bug) => {
      const matchesSearch = !query || bug.title?.toLowerCase().includes(query);
      const matchesAssignee =
        assignedTo === "all" ||
        (bug.assignToDev || []).some((dev) => dev._id === assignedTo);
      return matchesSearch && matchesAssignee;
    });
  }, [bugs, search, assignedTo]);

  const assignedToOptions = useMemo(() => {
    const uniqueDevs = new Map();
    bugs.forEach((bug) =>
      (bug.assignToDev || []).forEach((dev) => {
        if (dev?._id) uniqueDevs.set(dev._id, dev.name);
      }),
    );
    return [
      { value: "all", label: "Assigned To" },
      ...Array.from(uniqueDevs, ([value, label]) => ({ value, label })),
    ];
  }, [bugs]);

  const handleStatusChange = async (bugId, status) => {
    const previous = bugs;
    setBugs((prev) =>
      prev.map((b) => (b._id === bugId ? { ...b, status } : b)),
    );
    try {
      await UpdateStatus(projectId, bugId, status);
    } catch (err) {
      setBugs(previous);
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleViewDetails = (bugId) => {
    navigate(`/projects/${projectId}/bugs/${bugId}`);
  };

  const handleDelete = (bugId) => {
    setBugToDelete(bugId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!bugToDelete) return;

    try {
      setError("");

      await DeleteBug(projectId, bugToDelete);
      await loadBugs();

      setIsDeleteModalOpen(false);
      setBugToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete bug");
    }
  };

  const canChangeStatus = (bug) => {
    if (!user || user.user_type !== "developer") return false;
    return (bug.assignToDev || []).some((dev) => dev._id === user.userId);
  };

  const canDelete = (bug) => {
    if (!user) return false;
    const isManager = user.user_type === "manager";
    const isReporter = (bug.reporter?._id || bug.reporter) === user.userId;
    return isManager || isReporter;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="All bugs listing"
          showSearch={false}
          actionLabel={user?.user_type === "qa" ? "New Task bug" : undefined}
          onAction={
            user?.user_type === "qa" ? () => setIsBugModalOpen(true) : undefined
          }
        />

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-body-small text-status-pending">
            {error}
          </div>
        )}

        {/* <Card className="mb-6">
  <h2 className="mb-3 text-body2 font-semibold text-gray-900">Project Team</h2>

  <div className="grid gap-4 sm:grid-cols-2">
    <div>
      <p className="mb-2 text-body-small font-semibold text-gray-500">QAs</p>
      <div className="space-y-2">
        {project?.assignedqas?.length > 0 ? (
          project.assignedqas.map((qa) => (
            <div key={qa._id} className="flex items-center gap-2">
              <Avatar name={qa.name} size="sm" />
              <span className="text-body-small text-gray-900">{qa.name} ({qa.email})</span>
            </div>
          ))
        ) : (
          <span className="text-body-small text-gray-400">None assigned</span>
        )}
      </div>
    </div>

    <div>
      <p className="mb-2 text-body-small font-semibold text-gray-500">Developers</p>
      <div className="space-y-2">
        {project?.assigneddeveloper?.length > 0 ? (
          project.assigneddeveloper.map((dev) => (
            <div key={dev._id} className="flex items-center gap-2">
              <Avatar name={dev.name} size="sm" />
              <span className="text-body-small text-gray-900">{dev.name} ({dev.email})</span>
            </div>
          ))
        ) : (
          <span className="text-body-small text-gray-400">None assigned</span>
        )}
      </div>
    </div>
  </div>
</Card> */}

        <BugsToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          assignedToValue={assignedTo}
          onAssignedToChange={(e) => setAssignedTo(e.target.value)}
          assignedToOptions={assignedToOptions}
          view={view}
          onViewChange={setView}
        />

        {view === "grid" ? (
          <BugGrid
            bugs={filteredBugs}
            loading={loading}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            canChangeStatus={canChangeStatus}
            canDelete={canDelete}
          />
        ) : (
          <BugTable
            bugs={filteredBugs}
            loading={loading}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            canChangeStatus={canChangeStatus}
            canDelete={canDelete}
          />
        )}
      </main>

      {user?.user_type === "qa" && (
        <CreateBugModal
          isOpen={isBugModalOpen}
          onClose={() => setIsBugModalOpen(false)}
          projectId={projectId}
          developers={project?.assigneddeveloper || []}
          onCreated={loadBugs}
        />
      )}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBugToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Bug"
        message="Are you sure you want to delete this bug? This action cannot be undone."
      />
    </div>
  );
}
