import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4"
      onClick={onClose}
    >
      <div
        className={`flex w-full ${className || "max-w-md"} max-h-[85vh] flex-col overflow-hidden rounded-xl bg-white shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-h2 font-heading text-gray-900 px-6 pt-6 pb-4">
            {title}
          </h2>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="border-t border-gray-200 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}