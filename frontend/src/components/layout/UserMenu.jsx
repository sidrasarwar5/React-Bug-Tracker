import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

export default function UserMenu({ user }) {
  return (
    <Link to="/profile" className="flex items-center gap-2">
      <Avatar name={user?.name} src={user?.avatarUrl} size="md" />
      <span className="text-body-small font-medium text-gray-800">
        {user?.name}
      </span>
    </Link>
  );
}
