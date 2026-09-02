import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth";

import { getProjectBugs, UpdateStatus, DeleteBug } from "../api/bug";
import Navbar from "../components/layout/Navbar";
import PageHeader from "../components/manager/PageHeader";
import BugsToolbar from "../components/bugs/BugsToolbar";
import BugGrid from "../components/bugs/BugGrid";
import BugTable from "../components/bugs/BugTable";

export default function ProjectBugsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [assignedTo, setAssignedTo] = useState("all");

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
    if (projectId) loadBugs();
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

  const handleDelete = async (bugId) => {
    try {
      setError("");

      await DeleteBug(projectId, bugId);

      await loadBugs();
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
            user?.user_type === "qa"
              ? () => navigate(`/projects/${projectId}`)
              : undefined
          }
        />
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-body-small text-status-pending">
            {error}
          </div>
        )}

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
    </div>
  );
}
