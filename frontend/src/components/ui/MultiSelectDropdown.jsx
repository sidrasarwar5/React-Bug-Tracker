import { useState, useRef, useEffect } from "react";
import AvatarGroup from "./AvatarGroup";
import Avatar from "./Avatar";

export default function MultiSelectDropdown({
  options,
  selectedIds,
  onChange,
  placeholder = "Assign to",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedUsers = options.filter((opt) => selectedIds.includes(opt._id));

  function toggle(id) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-body-small text-gray-700 hover:border-primary"
      >
        {selectedUsers.length > 0 ? (
          <AvatarGroup users={selectedUsers} size="sm" />
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <div className=" custom-scrollbar absolute left-0 top-full z-10 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((user) => (
            <label
              key={user._id}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-body-small text-gray-700 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(user._id)}
                onChange={() => toggle(user._id)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />

              <Avatar name={user.name} size="sm" />

              <span className="min-w-0 truncate">{user.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
