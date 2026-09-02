import BugCard from "./BugCard";

export default function BugGrid({
  bugs,
  loading,
  onViewDetails,
  onStatusChange,
  onDelete,
  canChangeStatus,
  canDelete,
}) {
  if (loading) {
    return <p className="text-body-small text-gray-500">Loading bugs...</p>;
  }

  if (bugs.length === 0) {
    return (
      <p className="text-body-small text-gray-500">
        No bugs reported for this project yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bugs.map((bug) => (
        <BugCard
          key={bug._id}
          bug={bug}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          canChangeStatus={canChangeStatus(bug)}
          canDelete={canDelete(bug)}
        />
      ))}
    </div>
  );
}