const typeStyles = {
  text: 'h-4 rounded w-full',
  avatar: 'rounded-full',
  card: 'rounded-xl h-48 w-full',
  image: 'rounded-lg h-32 w-full',
};

export default function Skeleton({
  type = 'text',
  width,
  height,
  count = 1,
  className = '',
}) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {items.map((i) => (
        <div
          key={i}
          className={`
            animate-pulse bg-gray-200 dark:bg-gray-700
            ${typeStyles[type]}
            ${width ? '' : ''}
            ${className}
          `}
          style={{
            width: width || (type === 'avatar' ? '3rem' : undefined),
            height: height || (type === 'avatar' ? '3rem' : undefined),
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
