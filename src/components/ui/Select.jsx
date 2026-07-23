import { HiChevronDown } from 'react-icons/hi';

export default function Select({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Select an option',
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
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-gray-900
            appearance-none transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
            dark:focus:ring-blue-400
            ${error ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : 'cursor-pointer'}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={typeof opt === 'object' ? opt.value : opt}
              value={typeof opt === 'object' ? opt.value : opt}
            >
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <HiChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
