import { useState, useRef } from 'react';
import { HiUpload, HiX, HiDocument } from 'react-icons/hi';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function FileUpload({
  label,
  onUpload,
  multiple = false,
  accept = '*',
  maxSize,
  currentFiles = [],
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (files) => {
    setError('');
    const fileArray = Array.from(files);

    if (maxSize) {
      const oversized = fileArray.find((f) => f.size > maxSize);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds ${formatSize(maxSize)}`);
        return;
      }
    }

    onUpload?.(fileArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    if (e.target.files.length) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  return (
    <div className="w-full">
      {label && (
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </p>
      )}

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed
          cursor-pointer transition-colors duration-200
          ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-800/50'
          }
        `}
      >
        <HiUpload
          className={`${dragOver ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
          size={32}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Click to upload
          </span>{' '}
          or drag and drop
        </p>
        {accept !== '*' && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Accepted: {accept}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {currentFiles.length > 0 && (
        <ul className="mt-3 space-y-2">
          {currentFiles.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm"
            >
              <HiDocument className="text-gray-400 shrink-0" size={18} />
              <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                {file.name || file}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                {file.size ? formatSize(file.size) : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
