export default function Input({
  label,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400 dark:text-gray-500" size={18} />
          </div>
        )}
        <input
          required={required}
          {...props}
          className={`
            w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900
            placeholder-gray-400 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
            dark:border-gray-600 dark:focus:ring-blue-400
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
