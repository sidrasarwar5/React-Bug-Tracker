export default function Card({ children, className = "", bordered = true, style }) {
  return (
    <div
      className={`rounded bg-white p-5 ${
        bordered ? "border border-gray-200" : ""
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}