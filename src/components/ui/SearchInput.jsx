import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className = '',
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  const handleClear = () => {
    onChange?.('');
    onSearch?.('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-blue-400"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <HiX size={18} />
        </button>
      )}
    </div>
  );
}
