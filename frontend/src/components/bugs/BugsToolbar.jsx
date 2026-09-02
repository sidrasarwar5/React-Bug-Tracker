import { Filter, ArrowUpDown, LayoutGrid, List, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function BugsToolbar({
  searchValue,
  onSearchChange,
  assignedToValue,
  onAssignedToChange,
  assignedToOptions,
  view,
  onViewChange,
}) {
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

      <div className="flex items-center gap-2">
        <Select
          value={assignedToValue}
          onChange={onAssignedToChange}
          options={assignedToOptions}
          className="w-40"
        />

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          aria-label="Filter"
        >
          <Filter size={16} />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          aria-label="Sort"
        >
          <ArrowUpDown size={16} />
        </button>

        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-pressed={view === "grid"}
            className={`flex h-10 w-10 items-center justify-center ${
              view === "grid" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid size={16} />
          </button>

          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-pressed={view === "list"}
            className={`flex h-10 w-10 items-center justify-center border-l border-gray-200 ${
              view === "list" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}