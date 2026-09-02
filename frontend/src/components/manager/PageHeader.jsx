import Button from "../ui/Button";
import Input from "../ui/Input";
import { Search } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  actionLabel,
  onAction,
  showSearch = true,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-l-4 border-status-closed py-1 pl-3 sm:pl-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h2 className="text-body2 font-semibold text-gray-900">{title}</h2>

        {subtitle && (
          <p className="text-body-small text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
        {showSearch && (
          <div className="w-full sm:min-w-0 sm:flex-1 lg:w-64">
            <Input
              icon={Search}
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
        )}

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