import { Link } from "react-router-dom";

export default function AuthSwitchLink({
  prompt,
  linkText,
  to,
  className = "",
}) {
  return (
    <p className={`auth-switch ${className}`}>
      <span>{prompt}</span>
      <Link to={to} className="auth-switch-link">
        {linkText}
      </Link>
    </p>
  );
}