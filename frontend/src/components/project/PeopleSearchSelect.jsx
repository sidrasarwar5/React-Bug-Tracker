import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Avatar from "../ui/Avatar";
import { searchUsers } from "../../api/user";

export default function PeopleSearchSelect({ selected, onChange, userType }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panelPosition, setPanelPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      return;
    }

    setLoading(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchUsers(query.trim(), userType);
        const filtered = results.filter(
          (u) => !selected.some((s) => s._id === u._id),
        );
        setMatches(filtered);
      } catch (err) {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, userType, selected]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openPanel() {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(true);
  }

  function handleSelect(user) {
    onChange([...selected, user]);
    setQuery("");
    setMatches([]);
    setIsOpen(false);
  }

  function handleRemove(userId) {
    onChange(selected.filter((u) => u._id !== userId));
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          openPanel();
        }}
        onFocus={openPanel}
        placeholder="Search by name or email..."
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-body-small text-gray-900 outline-none focus:border-primary focus:bg-white"
      />

      {isOpen &&
        query.trim() &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[9999] max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg custom-scrollbar"
            style={{
              top: `${panelPosition.top}px`,
              left: `${panelPosition.left}px`,
              width: `${panelPosition.width}px`,
            }}
          >
            {loading && (
              <p className="px-3 py-2 text-body-xs text-gray-400">
                Searching...
              </p>
            )}

            {!loading && matches.length === 0 && (
              <p className="px-3 py-2 text-body-xs text-gray-400">No matches</p>
            )}

            {!loading &&
              matches.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                >
                  <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-body-small font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-body-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
          </div>,
          document.body,
        )}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((user) => (
            <span
              key={user._id}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-1 pr-2 text-body-small text-gray-700"
            >
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              {user.name}
              <button
                type="button"
                onClick={() => handleRemove(user._id)}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
