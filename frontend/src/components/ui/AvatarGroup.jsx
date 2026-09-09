import Avatar from "./Avatar";

export default function AvatarGroup({ users = [], max = 2, size = "sm" }) {
  if (users.length === 0) {
    return <span className="text-body-small text-gray-400">Unassigned</span>;
  }

  const visible = users.slice(0, max);


  return (
    <div className="flex items-center -space-x-2">
      {visible.map((user) => (
        <Avatar key={user._id} name={user.name} src={user.avatarUrl} size={size} />
      ))}

     
    
    </div>
  );
}