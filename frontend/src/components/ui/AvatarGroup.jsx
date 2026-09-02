import Avatar from "./Avatar";

export default function AvatarGroup({ users = [], max = 2, size = "sm" }) {
  if (users.length === 0) {
    return <span className="text-body-small text-gray-400">Unassigned</span>;
  }

  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((user) => (
        <Avatar key={user._id} name={user.name} size={size} />
      ))}

      {overflow > 0 && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-body-small font-semibold text-gray-700 ring-2 ring-white">
          +{overflow}
        </span>
      )}
    </div>
  );
}