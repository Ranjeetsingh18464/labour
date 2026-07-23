const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const bgColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function getInitials(name) {
  return name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';
}

function getColor(name) {
  if (!name) return bgColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

export default function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
}) {
  const initials = getInitials(name);
  const colorClass = getColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`
          rounded-full object-cover border-2 border-gray-200 dark:border-gray-700
          ${sizeStyles[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-bold text-white
        border-2 border-gray-200 dark:border-gray-700
        ${colorClass}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
