import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  iconSrc,
  isPassword = false,
  error,
  required = false,
  className = "",
  inputTextClassName = "text-gray-900",
  showLabel = true,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const resolvedType = isPassword ? (visible ? "text" : "password") : type;

  const defaultFilter =
    "brightness(0) saturate(100%) invert(59%) sepia(9%) saturate(650%) hue-rotate(190deg) brightness(92%) contrast(90%)";

  const focusFilter =
    "brightness(0) saturate(100%) invert(13%) sepia(71%) saturate(6790%) hue-rotate(242deg) brightness(37%) contrast(71%)";

  return (
    <div className={className || "w-full"}>
      <div className="relative w-[80%]">
        {iconSrc && (
          <img
            src={iconSrc}
            alt=""
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 object-contain transition-[filter] duration-200"
            style={{ filter: isFocused ? focusFilter : defaultFilter }}
          />
        )}

        {Icon && !iconSrc && (
          <Icon
            size={16}
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              isFocused ? "text-[#2F3367]" : "text-gray-400"
            }`}
          />
        )}

        <input
          id={props.id || label}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholder=" "
          required={required}
          className={`input-field peer w-full bg-gray-100 px-3.5 pt-4 pb-1.5 ${inputTextClassName} focus:text-gray-900 outline-none transition-colors duration-200 focus:bg-white focus:border-2 focus:border-lightBlue ${
            iconSrc || Icon ? "pl-9" : ""
          } ${isPassword ? "pr-9" : ""} ${
            error ? "border-red-500" : "border-transparent"
          }`}
          {...props}
        />

        {showLabel !== false && (
          <label
            htmlFor={props.id || label}
            className={`input-label pointer-events-none absolute top-1/2 -translate-y-1/2 bg-gray-100 px-1 text-gray-400 transition-all duration-200
      ${showLabel === "onFocus" ? "opacity-0 peer-focus:opacity-100" : ""}
      peer-focus:top-0
      peer-focus:-translate-y-1/2
      peer-focus:text-[11px]
      peer-focus:font-normal
      peer-focus:text-gray-900
      peer-focus:bg-white

      peer-[:not(:placeholder-shown)]:top-0
      peer-[:not(:placeholder-shown)]:-translate-y-1/2
      peer-[:not(:placeholder-shown)]:text-[11px]
      peer-[:not(:placeholder-shown)]:font-normal
      peer-[:not(:placeholder-shown)]:bg-white

      ${iconSrc || Icon ? "left-9" : "left-3.5"}
    `}
          >
            {placeholder || label}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-body-xs text-red-500">{error}</p>}
    </div>
  );
}
