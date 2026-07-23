import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export default function StarRating({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}) {
  const [hovered, setHovered] = useState(0);

  const displayRating = interactive && hovered ? hovered : rating;

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayRating;

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(0)}
              className={`${sizeStyles[size]} transition-colors duration-150 ${
                filled
                  ? 'text-yellow-400 dark:text-yellow-300'
                  : 'text-gray-300 dark:text-gray-600'
              } hover:text-yellow-400 dark:hover:text-yellow-300`}
            >
              {filled ? <FaStar /> : <FaRegStar />}
            </button>
          );
        }

        return (
          <span
            key={i}
            className={`${sizeStyles[size]} ${
              filled
                ? 'text-yellow-400 dark:text-yellow-300'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            {filled ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </div>
  );
}
