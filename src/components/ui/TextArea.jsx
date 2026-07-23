export default function TextArea({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`
          w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900
          placeholder-gray-400 transition-colors duration-200 resize-vertical
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
          dark:border-gray-600 dark:focus:ring-blue-400
          ${error ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
