import { API_BASE_URL } from "../../api/axios";

export default function Avatar({ name, src, size = "sm" }) {
  const sizes = {
    sm: "h-8 w-8 text-body-small",
    md: "h-9 w-9 text-body-small",
    xl: "h-24 w-24 text-3xl",
  };

  const initial = name?.[0]?.toUpperCase() || "?";

  const imageSrc = src
    ? src.startsWith("http") || src.startsWith("blob:")
      ? src
      : `${API_BASE_URL}${src}`
    : null;

  return (
    <span
      title={name}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-white ring-2 ring-white ${
        sizes[size]
      }`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name || "User avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}