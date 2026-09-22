import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useToast } from "../context/ToastContext";
import { getAllBugs, UpdateStatus, DeleteBug } from "../api/bug";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/project/PageHeader";
import BugsToolbar from "../components/bugs/BugsToolbar";
import BugGrid from "../components/bugs/BugGrid";
import BugTable from "../components/bugs/BugTable";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function AllBugsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [assignedTo, setAssignedTo] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [reportedFilter, setReportedFilter] = useState("all");
  const [bugToDelete, setBugToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadBugs = async () => {
    try {
      setLoading(true);
      const data = await getAllBugs();
      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to load bugs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBugs();
  }, []);

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

  // Precompute each bug's permission flags ONCE here, only when the
  // filtered list or user changes — instead of calling canChangeStatus()/
  // canDelete() functions per bug on every single render inside the grid
  // or table. This keeps things fast once the bug list grows large.
  const bugsWithPermissions = useMemo(() => {
    return filteredBugs.map((bug) => {
      const canChangeStatus =
        user?.user_type === "developer" &&
        (bug.assignToDev || []).some((dev) => dev._id === user.userId);

      const isManager = user?.user_type === "manager";
      const isReporter = (bug.reporter?._id || bug.reporter) === user?.userId;
      const canDelete = Boolean(user) && (isManager || isReporter);

      return {
        ...bug,
        canChangeStatus,
        canDelete,
      };
    });
  }, [filteredBugs, user]);

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
    const bug = bugs.find((b) => b._id === bugId);
    const projectId = bug?.projectRef?._id || bug?.projectRef;
    if (!projectId) return;

    const previous = bugs;
    setBugs((prev) =>
      prev.map((b) => (b._id === bugId ? { ...b, status } : b)),
    );
    try {
      await UpdateStatus(projectId, bugId, status);
      showSuccess("Bug status updated");
    } catch (err) {
      setBugs(previous);
      showError(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleViewDetails = (bugId) => {
    const bug = bugs.find((b) => b._id === bugId);
    const projectId = bug?.projectRef?._id || bug?.projectRef;
    if (projectId) {
      navigate(`/projects/${projectId}/bugs/${bugId}`);
    }
  };

  const handleDelete = (bugId) => {
    setBugToDelete(bugId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!bugToDelete) return;

    const bug = bugs.find((b) => b._id === bugToDelete);
    const projectId = bug?.projectRef?._id || bug?.projectRef;
    if (!projectId) return;

    try {
      await DeleteBug(projectId, bugToDelete);
      await loadBugs();

      showSuccess("Bug deleted");
      setIsDeleteModalOpen(false);
      setBugToDelete(null);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to delete bug");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="All bugs listing"
          showSearch={false}
          showBar={false}
          largeTitle={true}
        />

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
            bugs={bugsWithPermissions}
            loading={loading}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            canChangeStatus={(bug) => bug.canChangeStatus}
            canDelete={(bug) => bug.canDelete}
          />
        ) : (
          <BugTable
            bugs={bugsWithPermissions}
            loading={loading}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            canChangeStatus={(bug) => bug.canChangeStatus}
            canDelete={(bug) => bug.canDelete}
          />
        )}
      </main>

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