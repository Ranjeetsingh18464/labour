import { forwardRef } from 'react';

const TextArea = forwardRef(function TextArea(
  { label, error, rows = 4, required = false, className = '', ...props },
  ref
) {
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
      <textarea
        ref={ref}
        rows={rows}
        required={required}
        {...props}
        className={`
          w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900
          placeholder-gray-400 transition-colors duration-200 resize-vertical
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
          dark:border-gray-600 dark:focus:ring-blue-400
          ${error ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});

export default TextArea;
