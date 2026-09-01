import { useState, useRef, useEffect } from "react";


export default function UserMenu({ user, items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = user?.name?.[0]?.toUpperCase() || "?";
  console.log("UserMenu user:", user);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-body-small font-semibold text-white">
          {initial}
        </span>
        <span className="text-body-small font-medium text-gray-800">
          {user?.name}
        </span>
      </button>

      {open && items.length > 0 && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full px-4 py-2 text-left text-body-small text-gray-800 hover:bg-gray-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}