import { useState, useRef, useLayoutEffect } from "react";
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
  variant = "filled",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cursorPos = useRef(null);
  const inputRef = useRef(null);
  const selStart = useRef(null);
  const selEnd = useRef(null);

  // Star masking only while the password is hidden
  const isMasked = isPassword && !visible;

  const defaultFilter =
    "brightness(0) saturate(100%) invert(59%) sepia(9%) saturate(650%) hue-rotate(190deg) brightness(92%) contrast(90%)";

  const focusFilter =
    "brightness(0) saturate(100%) invert(13%) sepia(71%) saturate(6790%) hue-rotate(242deg) brightness(37%) contrast(71%)";

  const isOutline = variant === "outline";

  const inputBgBorderClass = isOutline
    ? `bg-white border border-gray-200 rounded-lg focus:border-2 focus:border-primary ${
        error ? "border-red-500" : ""
      }`
    : `bg-gray-100 focus:bg-white focus:border-2 focus:border-primary ${
        error ? "border-red-500" : "border-transparent"
      }`;

  const labelBgClass = isOutline
    ? "bg-white peer-focus:bg-white peer-[:not(:placeholder-shown)]:bg-white"
    : "bg-gray-100 peer-focus:bg-white peer-[:not(:placeholder-shown)]:bg-white";

  // Password fields are always rendered as type="text" so we can fake the
  // masking character ourselves (asterisks) instead of the browser's
  // native dots — the real password never sits in the masked DOM value.
  const resolvedType = isPassword ? "text" : type;
  const displayValue = isMasked ? "*".repeat(value.length) : value;

  // Capture the cursor/selection BEFORE the DOM mutates, so we know exactly
  // where the edit happened in the real (unmasked) value.
  function handleBeforeInput(e) {
    selStart.current = e.target.selectionStart;
    selEnd.current = e.target.selectionEnd;
  }

  function handleChange(e) {
    // Not a password field, or password is currently visible as plain text:
    // the displayed value IS the real value, so just pass it through.
    if (!isPassword || visible) {
      onChange(e);
      return;
    }

    // Password is masked — e.target.value is the MASKED string with the new
    // keystroke merged in, which is NOT the real password. Reconstruct the
    // real value using the native InputEvent, which still reports the
    // actual character(s) typed/deleted regardless of masking.
    const native = e.nativeEvent;
    const prevReal = value;
    const start = selStart.current ?? prevReal.length;
    const end = selEnd.current ?? start;
    const inputType = native.inputType;

    let newReal = prevReal;
    let newCursor = start;

    if (inputType && inputType.startsWith("insert")) {
      const inserted = native.data ?? "";
      newReal = prevReal.slice(0, start) + inserted + prevReal.slice(end);
      newCursor = start + inserted.length;
    } else if (inputType === "deleteContentBackward") {
      if (start !== end) {
        newReal = prevReal.slice(0, start) + prevReal.slice(end);
        newCursor = start;
      } else if (start > 0) {
        newReal = prevReal.slice(0, start - 1) + prevReal.slice(start);
        newCursor = start - 1;
      }
    } else if (inputType === "deleteContentForward") {
      if (start !== end) {
        newReal = prevReal.slice(0, start) + prevReal.slice(end);
        newCursor = start;
      } else {
        newReal = prevReal.slice(0, start) + prevReal.slice(start + 1);
        newCursor = start;
      }
    }

    cursorPos.current = newCursor;

    // Hand the parent a synthetic event carrying the REAL reconstructed value.
    onChange({
      ...e,
      target: {
        ...e.target,
        value: newReal,
        name: e.target.name,
        id: e.target.id,
      },
    });
  }

 
  useLayoutEffect(() => {
    if (isMasked && inputRef.current && cursorPos.current !== null) {
      inputRef.current.setSelectionRange(cursorPos.current, cursorPos.current);
    }
  }, [value, isMasked]);

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
          ref={inputRef}
          id={props.id || label}
          type={resolvedType}
          value={displayValue}
          onBeforeInput={handleBeforeInput}
          onChange={handleChange}
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
          autoComplete={isPassword ? "new-password" : props.autoComplete}
          className={`input-field ${isMasked ? "input-field-masked" : ""} peer w-full px-3.5 pt-4 pb-1.5 ${
            isMasked
              ? "text-black text-lg font-bold tracking-wider"
              : inputTextClassName
          } ${
            isMasked ? "focus:text-black" : "focus:text-gray-900"
          } outline-none transition-colors duration-200 ${inputBgBorderClass} ${
            iconSrc || Icon ? "pl-9" : ""
          } ${isPassword ? "pr-9" : ""}`}
          {...props}
        />

        {showLabel !== false && (
          <label
            htmlFor={props.id || label}
            className={`input-label pointer-events-none absolute top-1/2 -translate-y-1/2 px-1 text-gray-400 transition-all duration-200 ${labelBgClass}
      ${showLabel === "onFocus" ? "opacity-0 peer-focus:opacity-100" : ""}
      peer-focus:top-0
      peer-focus:-translate-y-1/2
      peer-focus:text-[11px]
      peer-focus:font-normal
      peer-focus:text-gray-900

      peer-[:not(:placeholder-shown)]:top-0
      peer-[:not(:placeholder-shown)]:-translate-y-1/2
      peer-[:not(:placeholder-shown)]:text-[11px]
      peer-[:not(:placeholder-shown)]:font-normal

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
