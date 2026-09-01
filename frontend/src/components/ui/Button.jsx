export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className = '',
  disabled = false,
  icon = null,
}) {
  const baseStyle = "font-semibold  px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  accent: "bg-accent text-gray-900 hover:bg-accent-hover",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};
  return (
    <button 
      type={type} 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    >
      {children}
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  );
}