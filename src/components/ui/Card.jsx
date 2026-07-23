import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'p-6',
}) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200
        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
        ${onClick ? 'cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}
