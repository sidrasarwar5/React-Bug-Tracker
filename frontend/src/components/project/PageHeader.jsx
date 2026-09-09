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
  showBar = true,
  largeTitle = false,
}) {
  return (
    <div className="relative mb-6 flex flex-col gap-4 border-t border-b border-gray-200 py-4 pl-6 sm:pl-7 lg:flex-row lg:items-center lg:justify-between">
      {showBar && (
        <span className="absolute top-2 bottom-2 left-3 w-1 rounded-full bg-status-closed" />
      )}

      <div className="min-w-0">
        <h2
          className={
            largeTitle
              ? "truncate font-['Inter'] text-[20px] font-extrabold leading-tight tracking-[-2.2%] text-[#252C32] sm:text-[22px] lg:text-[25px] lg:leading-[48px]"
              : "truncate font-[Poppins] text-[15px] font-semibold leading-normal tracking-[0%] text-[#000000] sm:text-[16px]"
          }
        >
          {title}
        </h2>

        {subtitle && (
          <p className="truncate font-[Poppins] text-[13px] font-normal leading-normal tracking-[0%] text-[#AEAEAE] sm:text-[14px]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-5 lg:w-auto lg:shrink-0">
        {showSearch && (
          <div className="header-search w-full sm:min-w-0 sm:flex-1 lg:w-64 [&>div>div]:!w-full">
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
