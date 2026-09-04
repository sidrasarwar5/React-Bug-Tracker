import { useEffect, useRef, useState } from "react";
import {
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Search,
  Check,
} from "lucide-react";
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
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-xs">
        <Input
          icon={Search}
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search bugs..."
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={assignedToValue}
          onChange={onAssignedToChange}
          options={assignedToOptions}
          className="w-40"
        />
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen((prev) => !prev);
              setIsSortOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Filter"
          >
            <Filter size={16} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-52 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
        
              {showReportedFilter && (
                <>
                  <p className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">
                    Bugs
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onReportedFilterChange("all");
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
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Sort"
          >
            <ArrowUpDown size={16} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
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
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-pressed={view === "grid"}
            className={`flex h-10 w-10 items-center justify-center ${
              view === "grid"
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid size={16} />
          </button>

          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-pressed={view === "list"}
            className={`flex h-10 w-10 items-center justify-center border-l border-gray-200 ${
              view === "list"
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
