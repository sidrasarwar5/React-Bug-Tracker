export default function Avatar({ name, size = "sm" }) {
  const sizes = {
    sm: "h-8 w-8 text-body-small",
    md: "h-9 w-9 text-body-small",
  };
  const initial = name?.[0]?.toUpperCase() || "?";

  return (
    <span
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white ring-2 ring-white ${sizes[size]}`}
    >
      {initial}
    </span>
  );
}