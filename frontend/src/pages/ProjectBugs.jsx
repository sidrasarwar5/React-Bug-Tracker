import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth";
import { getProjectBugs, UpdateStatus, DeleteBug } from "../api/bug";
import { getProjects } from "../api/project";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/project/PageHeader";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [reportedFilter, setReportedFilter] = useState("all");
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

    const result = bugs.filter((bug) => {
      const matchesSearch = !query || bug.title?.toLowerCase().includes(query);
      const matchesAssignee =
        assignedTo === "all" ||
        (bug.assignToDev || []).some((dev) => dev._id === assignedTo);
      const matchesStatus =
        statusFilter === "all" ||
        bug.status === statusFilter ||
        (statusFilter === "resolved" && bug.status === "completed");
      const matchesReporter =
        reportedFilter === "all" ||
        (bug.reporter?._id || bug.reporter) === user?.userId;
      return (
        matchesSearch && matchesAssignee && matchesStatus && matchesReporter
      );
    });

    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "dueDate":
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  }, [bugs, search, assignedTo, statusFilter, reportedFilter, sortBy, user]);

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
          <div className="mb-6 rounded-lg bg-status-pending/10 p-3 text-body-small text-status-pending">
            {error}
          </div>
        )}

        <BugsToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          assignedToValue={assignedTo}
          onAssignedToChange={(e) => setAssignedTo(e.target.value)}
          assignedToOptions={assignedToOptions}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          reportedFilter={reportedFilter}
          onReportedFilterChange={setReportedFilter}
          showReportedFilter={user?.user_type === "qa"}
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
