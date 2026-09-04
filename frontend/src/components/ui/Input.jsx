import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  isPassword = false,
  error,
  required = false,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const resolvedType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary"
          />
        )}
        <input
          id={props.id || label}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          className={`peer w-full rounded-lg border bg-gray-100 px-3.5 pt-4 pb-1.5 text-body-small text-gray-900 outline-none transition-colors duration-200 focus:border-primary focus:bg-white ${
            Icon ? "pl-9" : ""
          } ${isPassword ? "pr-9" : ""} ${error ? "border-red-500" : "border-gray-200"}`}
          {...props}
        />
        <label
          htmlFor={props.id || label}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 bg-gray-100 px-1 text-gray-400 text-body-small transition-all duration-200
            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-gray-900 peer-focus:bg-white
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white
            ${Icon ? "left-9" : "left-3.5"}`}
        >
          {placeholder || label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-body-xs text-red-500">{error}</p>}
    </div>
  );
}