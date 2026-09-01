import { Link } from "react-router-dom";

export default function AuthSwitchLink({ prompt, linkText, to, className = "" }) {
  return (
    <p className={`text-body-small text-gray-500 ${className}`}>
      {prompt}{" "}
      <Link to={to} className="font-semibold text-primary">
        {linkText}
      </Link>
    </p>
  );
}