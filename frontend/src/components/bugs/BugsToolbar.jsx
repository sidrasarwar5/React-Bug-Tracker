import { useEffect, useRef, useState } from "react";
import { Check, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "Pending" },
  { value: "started", label: "In Progress" },
  { value: "resolved", label: "Closed" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "dueDate", label: "Due Date" },
  { value: "title", label: "Title (A-Z)" },
];

export default function BugsToolbar({
  searchValue,
  onSearchChange,
  assignedToValue,
  onAssignedToChange,
  assignedToOptions,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  reportedFilter,
  onReportedFilterChange,
  showReportedFilter,
  view,
  onViewChange,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }

      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }

    if (isFilterOpen || isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, isSortOpen]);

  return (
    // Bottom divider line (small grey border) added here via border-b + pb-4
    <div className="mb-4 flex w-full flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      <div className="w-full sm:w-64">
        <Input
          icon={Search}
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search bugs..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Select
          value={assignedToValue}
          onChange={onAssignedToChange}
          options={assignedToOptions}
          className="w-full min-w-[9rem] flex-1 sm:w-40 sm:flex-none"
        />

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200"
              aria-label="Filter"
            >
              <img
                src="/funnel.svg"
                alt="Filter"
                className="h-4 w-4 object-contain"
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-52 max-w-[90vw] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                {showReportedFilter && (
                  <>
                    <p className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">
                      Bugs
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        onReportedFilterChange("all");
                        setIsFilterOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-body-small text-gray-700 hover:bg-gray-50"
                    >
                      <span>All Bugs</span>

                      {reportedFilter === "all" && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onReportedFilterChange("mine");
                        setIsFilterOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-body-small text-gray-700 hover:bg-gray-50"
                    >
                      <span>My Bugs</span>

                      {reportedFilter === "mine" && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>

                    <div className="my-2 border-t border-gray-200" />
                  </>
                )}

                <p className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">
                  Status
                </p>

                {STATUS_FILTERS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onStatusFilterChange(opt.value);
                      setIsFilterOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-body-small text-gray-700 hover:bg-gray-50"
                  >
                    <span>{opt.label}</span>

                    {statusFilter === opt.value && (
                      <Check size={14} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsFilterOpen(false);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200"
              aria-label="Sort"
            >
              <img
                src="/sort.svg"
                alt="Sort"
                className="h-4 w-4 object-contain"
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-44 max-w-[90vw] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortByChange(opt.value);
                      setIsSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-body-small text-gray-700 hover:bg-gray-50"
                  >
                    {opt.label}

                    {sortBy === opt.value && (
                      <Check size={14} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 overflow-hidden rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-pressed={view === "grid"}
              className="flex h-10 w-10 items-center justify-center"
            >
              <img
                src={view === "grid" ? "/grid-active.svg" : "/grid.svg"}
                alt="Grid view"
                className="h-4 w-4 object-contain"
              />
            </button>

            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-pressed={view === "list"}
              className="flex h-10 w-10 items-center justify-center border-l border-gray-200"
            >
              <img
                src={view === "list" ? "/list-active.svg" : "/list.svg"}
                alt="List view"
                className="h-4 w-4 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}