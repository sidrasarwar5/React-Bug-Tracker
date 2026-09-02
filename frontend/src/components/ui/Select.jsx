import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  value,
  onChange,
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-body-small font-medium text-gray-800">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-lg border bg-gray-50 px-3.5 py-2.5 text-body-small text-gray-900 outline-none transition-colors duration-200 focus:border-primary focus:bg-white ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      {error && <p className="mt-1 text-body-xs text-red-500">{error}</p>}
    </div>
  );
}