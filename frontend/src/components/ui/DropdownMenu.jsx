import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export default function DropdownMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    right: 0,
  });

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen((prev) => !prev);
  }
  return (
    <div ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          className="fixed z-[9999] w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
          }}
        >
          {items.map((item, index) => {
            if (item.type === "header") {
              return (
                <div
                  key={`header-${index}`}
                  className="px-4 py-1.5 text-body-xs font-semibold text-gray-400"
                >
                  {item.label}
                </div>
              );
            }

            if (item.type === "divider") {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-1 border-t border-gray-100"
                />
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-body-small hover:bg-gray-50 ${
                  item.danger ? "text-status-pending" : "text-gray-700"
                }`}
              >
                {item.color && (
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                )}

                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
