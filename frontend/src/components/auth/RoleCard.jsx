import { ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";

export default function RoleCard({
  label,
  description,
  iconSrc,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center rounded-lg border",
        "px-4 py-3",
        "text-left transition-all duration-200",

        "border-[#E5E7EB] bg-white",

        "hover:border-[#007DFA]",
        "hover:bg-[#F5FAFF]",

        selected && "border-[#007DFA] bg-[#F5FAFF]"
      )}
    >

      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center",
          "rounded-full border-2 border-[#007DFA]",
          "bg-white transition-all duration-200",

          "group-hover:bg-[#007DFA]",

          selected && "bg-[#007DFA]"
        )}
      >
        <img
          src={iconSrc}
          alt={label}
          className={cn(
            "h-5 w-5 object-contain transition-all duration-200",
            "group-hover:brightness-0 group-hover:invert",
            selected && "brightness-0 invert"
          )}
        />
      </span>


      <span className="ml-4 flex-1">
        <span className="h2">
          {label}
        </span>

        <span className="description">
          {description}
        </span>
      </span>

    
      <ArrowRight
        size={18}
        className={cn(
          "ml-3 shrink-0 text-[#007DFA]",
          "opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100",
          selected && "opacity-100"
        )}
      />
    </button>
  );
}