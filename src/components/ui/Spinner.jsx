const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-10 h-10 border-4',
};

export default function Spinner({ size = 'md', color = 'border-blue-600', className = '' }) {
  return (
    <div
      className={`
        animate-spin rounded-full border-transparent border-t-current
        ${color}
        ${sizeStyles[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
