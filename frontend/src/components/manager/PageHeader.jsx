import { Search } from "lucide-react";
import Button from "../ui/Button";

export default function PageHeader({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  actionLabel,
  onAction,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-l-4 border-status-closed py-1 pl-3 sm:pl-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Title */}
      <div className="min-w-0">
        <h2 className="text-body2 font-semibold text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="text-body-small text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search + Action */}
      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
        {/* Search */}
        <div className="relative w-full sm:min-w-0 sm:flex-1 lg:w-64">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-body-small outline-none focus:border-primary focus:bg-white"
          />
        </div>

        {/* Action */}
        {actionLabel && (
          <Button
            onClick={onAction}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            + {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}