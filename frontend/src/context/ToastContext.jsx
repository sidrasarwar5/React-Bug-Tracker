import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

let idCounter = 0;

function ToastItem({ toast, onDismiss }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger slide-in on mount
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const isSuccess = toast.type === "success";

  return (
    <div
      style={{
        position: "relative",
        transform: show ? "translateY(0)" : "translateY(-80px)",
        opacity: show ? 1 : 0,
        transition:
          "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        minWidth: "280px",
        maxWidth: "480px",
        width: "max-content",
        padding: "12px 20px",
        borderRadius: "16px",
        border: `1px solid ${isSuccess ? "#6ee7b7" : "#fca5a5"}`,
        background: isSuccess ? "#ecfdf5" : "#fff1f2",
        color: isSuccess ? "#065f46" : "#be123c",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        pointerEvents: "auto",
      }}
    >
      <span style={{ fontSize: "16px", flexShrink: 0 }}>
        {isSuccess ? (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#059669" />
            <path
              d="M6 10l3 3 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#e11d48" />
            <path
              d="M7 7l6 6M13 7l-6 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>

      <span style={{ flex: 1 }}>{toast.message}</span>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          opacity: 0.6,
          color: "inherit",
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);

      timers.current[id] = setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  const showSuccess = useCallback(
    (message, duration) => showToast(message, "success", duration),
    [showToast],
  );

  const showError = useCallback(
    (message, duration) => showToast(message, "error", duration),
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}

      {createPortal(
        <div
          style={{
            position: "fixed",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
